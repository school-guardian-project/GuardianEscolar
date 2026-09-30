import { getAccessToken, refresh } from "./authService";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

function authHeaders() {
  const token = getAccessToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

/** GET a ms-fleet a través del API Gateway. */
export async function getFleetApi(path) {
  const url = `${API_URL}/fleet/api${path}`;

  let response = await fetch(url, { headers: authHeaders() });

  if (response.status === 401) {
    await refresh();
    response = await fetch(url, { headers: authHeaders() });
  }

  if (!response.ok) {
    const error = new Error(`fleet api request failed: ${response.status}`);
    error.status = response.status;
    throw error;
  }

  return response.json();
}

/** POST a ms-fleet a través del API Gateway. */
export async function postFleetApi(path, body) {
  const url = `${API_URL}/fleet/api${path}`;

  let response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(body),
  });

  if (response.status === 401) {
    await refresh();
    response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...authHeaders() },
      body: JSON.stringify(body),
    });
  }

  if (!response.ok) {
    const error = new Error(`fleet api request failed: ${response.status}`);
    error.status = response.status;
    throw error;
  }

  return response.status === 204 ? null : response.json();
}

/** PUT a ms-fleet a través del API Gateway. */
export async function putFleetApi(path, body) {
  const url = `${API_URL}/fleet/api${path}`;

  let response = await fetch(url, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(body),
  });

  if (response.status === 401) {
    await refresh();
    response = await fetch(url, {
      method: "PUT",
      headers: { "Content-Type": "application/json", ...authHeaders() },
      body: JSON.stringify(body),
    });
  }

  if (!response.ok) {
    const error = new Error(`fleet api request failed: ${response.status}`);
    error.status = response.status;
    throw error;
  }

  return response.status === 204 ? null : response.json();
}

/** DELETE a ms-fleet a través del API Gateway. */
export async function deleteFleetApi(path) {
  const url = `${API_URL}/fleet/api${path}`;

  let response = await fetch(url, {
    method: "DELETE",
    headers: authHeaders(),
  });

  if (response.status === 401) {
    await refresh();
    response = await fetch(url, {
      method: "DELETE",
      headers: authHeaders(),
    });
  }

  if (!response.ok) {
    const error = new Error(`fleet api request failed: ${response.status}`);
    error.status = response.status;
    throw error;
  }

  return response.status === 204 ? null : response.json();
}
