import * as SecureStore from "expo-secure-store";

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
  const response = await fetch(`${API_URL}/api/v1/auth${path}`, options);

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

function claimOf(data, claims, key, fallback = null) {
  const value = data?.[key] ?? claims[key] ?? fallback;
  return value === undefined || value === "" ? null : value;
}

/** Combina la respuesta del login con los claims del JWT (la respuesta puede no traer todos los campos). */
async function saveSession(data) {
  const claims = tokenClaims(data?.accessToken ?? accessToken);
  session = {
    profileId: claimOf(data, claims, "profileId", session?.profileId),
    personId: claimOf(data, claims, "personId", session?.personId),
    email: claimOf(data, claims, "email", session?.email),
    roleId: claimOf(data, claims, "roleId", session?.roleId),
    campusId: claimOf(data, claims, "campusId", session?.campusId),
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

/** Sesión del usuario logueado (profileId, personId, email, roleId). */
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
  return data;
}

/** Rotación one-way: el refresh token viaja en Authorization, no en cookie. */
export async function refresh() {
  const stored = await loadRefresh();
  if (!stored) {
    const error = new Error("no refresh token");
    error.status = 401;
    throw error;
  }

  const data = await request("/refresh", {
    method: "POST",
    headers: jsonBody({ Authorization: `Bearer ${stored}` }),
  });

  accessToken = data.accessToken;
  await getSession();
  await saveSession({});
  await saveRefresh(data.refreshToken);
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
  if (!accessToken) {
    return null;
  }
  try {
    const payload = accessToken.split(".")[1];
    const decoded = JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/")));
    return typeof decoded.roleId === "number" ? decoded.roleId : null;
  } catch {
    return null;
  }
}

/** Claim `campusId` del JWT. */
export function getCampusId() {
  if (!accessToken) {
    return null;
  }
  try {
    const payload = accessToken.split(".")[1];
    const decoded = JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/")));
    return typeof decoded.campusId === "string" ? decoded.campusId : null;
  } catch {
    return null;
  }
}
