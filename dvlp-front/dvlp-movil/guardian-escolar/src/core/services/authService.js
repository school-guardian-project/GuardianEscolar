import * as SecureStore from "expo-secure-store";
import { notifyAuthRoleChange } from "@core/dev/RoleSwitcherContext";

const API_URL = process.env.EXPO_PUBLIC_API_URL;
if (!API_URL) {
  throw new Error(
    "Falta EXPO_PUBLIC_API_URL en .env: define la URL del API Gateway (ver .env.example)."
  );
}

const REFRESH_KEY = "refresh_token";
const SESSION_KEY = "user_session";

let accessToken = null;
let session = null;

async function request(path, options = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 15000);
  let response;
  try {
    response = await fetch(`${API_URL}/api/v1/auth${path}`, {
      ...options,
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timer);
  }

  if (!response.ok) {
    const error = new Error(`auth request failed: ${response.status}`);
    error.status = response.status;
    throw error;
  }

  return response.status === 204 ? null : response.json();
}

function jsonBody(payload) {
  return {
    "Content-Type": "application/json",
    ...payload,
  };
}

async function saveRefresh(token) {
  if (await SecureStore.isAvailableAsync()) {
    await SecureStore.setItemAsync(REFRESH_KEY, token);
  }
}

async function loadRefresh() {
  if (!(await SecureStore.isAvailableAsync())) {
    return null;
  }
  return SecureStore.getItemAsync(REFRESH_KEY);
}

function tokenClaims(token) {
  if (!token) {
    return {};
  }
  try {
    const payload = token.split(".")[1];
    return JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/")));
  } catch {
    return {};
  }
}

function claimOf(data, claims, key) {
  if (data?.[key] === null) return null;
  const claim = key === "profileId" ? claims.profileId ?? claims.sub : claims[key];
  const value = data?.[key] ?? claim ?? null;
  return value === undefined || value === "" ? null : value;
}

/** Normaliza el claim `permissions` a un arreglo de strings (ignora valores malformados). */
function normalizePermissions(value) {
  return Array.isArray(value) ? value.filter((permission) => typeof permission === "string") : [];
}

/** Combina la respuesta del login con los claims del JWT (la respuesta puede no traer todos los campos). */
async function saveSession(data) {
  const claims = tokenClaims(data?.accessToken ?? accessToken);
  session = {
    profileId: claimOf(data, claims, "profileId"),
    personId: claimOf(data, claims, "personId"),
    email: claimOf(data, claims, "email"),
    roleId: claimOf(data, claims, "roleId"),
    roleName: claimOf(data, claims, "roleName") ?? claimOf(data, claims, "role"),
    identificationNumber:
      claimOf(data, claims, "identificationNumber") ?? claimOf(data, claims, "documentNumber"),
    permissions: normalizePermissions(data?.permissions ?? claims.permissions),
    campusId: claimOf(data, claims, "campusId"),
    schoolId: claimOf(data, claims, "schoolId"),
  };
  if (await SecureStore.isAvailableAsync()) {
    await SecureStore.setItemAsync(SESSION_KEY, JSON.stringify(session));
  }
}

export async function updateSessionEmail(email) {
  if (!session) {
    await getSession();
  }
  session = { ...(session ?? {}), email };
  if (await SecureStore.isAvailableAsync()) {
    await SecureStore.setItemAsync(SESSION_KEY, JSON.stringify(session));
  }
}

/** Sesión del usuario logueado, incluyendo escuela y sede. */
export async function getSession() {
  if (session) {
    return session;
  }
  if (await SecureStore.isAvailableAsync()) {
    const raw = await SecureStore.getItemAsync(SESSION_KEY);
    if (raw) {
      try {
        session = JSON.parse(raw);
      } catch {
        session = null;
      }
    }
  }
  return session;
}

export async function login(email, password) {
  const data = await request("/login", {
    method: "POST",
    headers: jsonBody(),
    body: JSON.stringify({ email, password }),
  });

  accessToken = data.accessToken;
  await saveSession(data);
  if (data.refreshToken) {
    await saveRefresh(data.refreshToken);
  }

  // Notificar al contexto React para que recargue la sesión y actualice el rol
  notifyAuthRoleChange();

  return data;
}

/** Rotación one-way: el refresh token viaja en Authorization, no en cookie. */
export async function refresh() {
  const stored = await loadRefresh();
  
  // Validar que existe y no está vacío
  if (!stored || stored.trim() === "") {
    console.warn("[authService.refresh] No refresh token stored or empty");
    const error = new Error("no refresh token");
    error.status = 401;
    error.code = "NO_REFRESH_TOKEN";
    throw error;
  }

  console.log("[authService.refresh] Attempting token refresh", {
    hasToken: true,
    tokenPrefix: stored.substring(0, 10) + "...",
    tokenLength: stored.length,
  });

  let response;
  try {
    response = await fetch(`${API_URL}/api/v1/auth/refresh`, {
      method: "POST",
      headers: jsonBody({ Authorization: `Bearer ${stored}` }),
      signal: AbortSignal.timeout(15000),
    });
  } catch (fetchError) {
    // Error de red (timeout, sin conexión, DNS, etc.)
    console.error("[authService.refresh] Network error during refresh", {
      message: fetchError.message,
      name: fetchError.name,
      code: fetchError.code,
    });
    const error = new Error(`Network error: ${fetchError.message}`);
    error.status = 0;
    error.code = "NETWORK_ERROR";
    error.isNetworkError = true;
    throw error;
  }

  // Log completo de la respuesta
  console.log("[authService.refresh] Response received", {
    status: response.status,
    statusText: response.statusText,
    headers: Object.fromEntries(response.headers.entries()),
  });

  let data;
  try {
    data = response.status === 204 ? null : await response.json();
  } catch (parseError) {
    console.error("[authService.refresh] Failed to parse response JSON", {
      error: parseError.message,
      status: response.status,
    });
    const error = new Error("Invalid response format");
    error.status = response.status;
    error.code = "INVALID_RESPONSE";
    throw error;
  }

  console.log("[authService.refresh] Response data", {
    hasAccessToken: !!data?.accessToken,
    hasRefreshToken: !!data?.refreshToken,
    accessTokenPrefix: data?.accessToken?.substring(0, 10) + "...",
  });

  if (!response.ok) {
    // Manejar errores HTTP específicos
    const error = new Error(`auth request failed: ${response.status}`);
    error.status = response.status;
    error.data = data;
    
    // Clasificar el tipo de error
    if (response.status === 401) {
      error.code = "TOKEN_EXPIRED_OR_REVOKED";
      console.warn("[authService.refresh] Refresh token expired or revoked (401)");
    } else if (response.status === 403) {
      error.code = "TOKEN_FORBIDDEN";
      console.warn("[authService.refresh] Refresh token forbidden (403)");
    } else if (response.status >= 500) {
      error.code = "SERVER_ERROR";
      error.isNetworkError = true; // Tratar 5xx como error de red para retry
      console.error("[authService.refresh] Server error (5xx)", { status: response.status });
    } else {
      error.code = `HTTP_${response.status}`;
      console.warn("[authService.refresh] HTTP error", { status: response.status, data });
    }
    
    throw error;
  }

  // Éxito: actualizar tokens y sesión
  accessToken = data.accessToken;
  await getSession();
  await saveSession({});
  
  if (data.refreshToken) {
    await saveRefresh(data.refreshToken);
    console.log("[authService.refresh] New refresh token saved");
  } else {
    console.warn("[authService.refresh] No new refresh token in response - keeping existing");
  }
  
  // Notificar al contexto React para que actualice el rol (claims pueden haber cambiado)
  notifyAuthRoleChange();
  
  console.log("[authService.refresh] Token refresh successful");
  return data.accessToken;
}

export async function logout() {
  try {
    if (accessToken) {
      await request("/logout", {
        method: "POST",
        headers: jsonBody({ Authorization: `Bearer ${accessToken}` }),
      });
    }
  } catch {
    // El token pudo haber expirado: la sesión local se limpia igual.
  } finally {
    await clearSession();
  }
}

export async function clearSession() {
  accessToken = null;
  session = null;
  if (await SecureStore.isAvailableAsync()) {
    await SecureStore.deleteItemAsync(REFRESH_KEY);
    await SecureStore.deleteItemAsync(SESSION_KEY);
  }
}

export async function hasSession() {
  return (await loadRefresh()) !== null;
}

export function getAccessToken() {
  return accessToken;
}

/** Claim `roleId` del JWT. Se decodifica sin verificar: la firma la valida el gateway. */
export function getRoleId() {
  const value = tokenClaims(accessToken).roleId;
  return typeof value === "number" ? value : null;
}

/** Claim `campusId` del JWT. */
export function getCampusId() {
  const value = tokenClaims(accessToken).campusId;
  return typeof value === "string" ? value : null;
}

/** Claim `role` del JWT: nombre legible del rol (p. ej. "Admin"). */
export function getRoleName() {
  const value = tokenClaims(accessToken).role;
  return typeof value === "string" && value !== "" ? value : null;
}

/** Claim `documentNumber` del JWT: número de identificación de la persona (FR-2.1). */
export function getIdentificationNumber() {
  const value = tokenClaims(accessToken).documentNumber;
  return typeof value === "string" && value !== "" ? value : null;
}

/** Claim `permissions` del JWT: permisos RBAC concedidos (FR-2.1). */
export function getPermissions() {
  return normalizePermissions(tokenClaims(accessToken).permissions);
}

/**
 * true si la sesión tiene alguno de los permisos indicados (semántica "any-of").
 * Sin permisos concedidos siempre devuelve false.
 */
export function hasPermission(...permissions) {
  if (permissions.length === 0) {
    return false;
  }
  const granted = getPermissions();
  return permissions.some((permission) => granted.includes(permission));
}
