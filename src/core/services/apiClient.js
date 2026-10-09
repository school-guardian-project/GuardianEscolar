import * as authService from "./authService";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

/**
 * Cliente HTTP que agrega automáticamente el Bearer token y maneja refresh.
 * 
 * @param {string} path - Ruta del endpoint (ej: "/api/v1/auth/profile")
 * @param {object} options - Opciones de fetch (method, headers, body, etc.)
 * @param {boolean} retry - Si es true, reintenta una vez después de refresh
 * @returns {Promise<any>} Respuesta JSON o null para 204
 */
export async function apiRequest(path, options = {}, retry = true) {
  return apiRequestAt(API_URL, path, options, retry, true);
}

export async function apiRequestAt(baseUrl, path, options = {}, retry = false, authenticated = false) {
  if (!baseUrl) {
    throw new Error("API base URL is not configured.");
  }

  const token = authenticated ? authService.getAccessToken() : null;
  
  const headers = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 15000);
  let response;
  try {
    response = await fetch(`${baseUrl.replace(/\/+$/, "")}${path}`, {
      ...options,
      headers,
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timer);
  }

  // Si es 401 y tenemos retry, intentar refresh
  if (response.status === 401 && retry) {
    try {
      await authService.refresh();
      // Reintentar la request con el nuevo token
      return apiRequestAt(baseUrl, path, options, false, authenticated);
    } catch (refreshError) {
      // Si el refresh falla, limpiar sesión y lanzar error
      await authService.clearSession();
      throw refreshError;
    }
  }

  if (!response.ok) {
    const error = new Error(`API request failed: ${response.status}`);
    error.status = response.status;
    try {
      error.data = await response.json();
    } catch {
      // No hay body JSON
    }
    throw error;
  }

  return response.status === 204 ? null : response.json();
}

/**
 * Helper para requests GET
 */
export function apiGet(path, options = {}) {
  return apiRequest(path, { ...options, method: "GET" });
}

/**
 * Helper para requests POST
 */
export function apiPost(path, body, options = {}) {
  return apiRequest(path, {
    ...options,
    method: "POST",
    body: JSON.stringify(body),
  });
}

/**
 * Helper para requests PUT
 */
export function apiPut(path, body, options = {}) {
  return apiRequest(path, {
    ...options,
    method: "PUT",
    body: JSON.stringify(body),
  });
}

/**
 * Helper para requests DELETE
 */
export function apiDelete(path, options = {}) {
  return apiRequest(path, { ...options, method: "DELETE" });
}
