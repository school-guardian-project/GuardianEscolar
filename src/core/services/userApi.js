import { getAccessToken, refresh } from "./authService";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

function authHeaders() {
  const token = getAccessToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

/** GET a ms-user-management a través del API Gateway. */
export async function getUserApi(path) {
  const url = `${API_URL}/user/api${path}`;

  let response = await fetch(url, { headers: authHeaders() });

  if (response.status === 401) {
    // App recién abierta o token expirado: rota con el refresh token guardado.
    await refresh();
    response = await fetch(url, { headers: authHeaders() });
  }

  if (!response.ok) {
    const error = new Error(`user api request failed: ${response.status}`);
    error.status = response.status;
    throw error;
  }

  return response.json();
}
