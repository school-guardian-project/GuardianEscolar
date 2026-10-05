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
  const token = authService.getAccessToken();
  
  const headers = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });

  // Si es 401 y tenemos retry, intentar refresh
  if (response.status === 401 && retry) {
    try {
      await authService.refresh();
      // Reintentar la request con el nuevo token
      return apiRequest(path, options, false);
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
