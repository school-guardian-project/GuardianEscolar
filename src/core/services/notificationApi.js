import { getAccessToken, refresh } from "./authService";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

function authHeaders() {
  const token = getAccessToken();

  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function postNotificationApi(path, body) {
  const url = `${API_URL}/notification/api${path}`;

  let response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
    },
    body: JSON.stringify(body),
  });

  if (response.status === 401) {
    await refresh();

    response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...authHeaders(),
      },
      body: JSON.stringify(body),
    });
  }

  if (!response.ok) {
    const error = new Error(
      `notification api request failed: ${response.status}`
    );

    error.status = response.status;
    throw error;
  }

  return response.status === 204 ? null : response.json();
}

export async function getNotificationApi(path) {
  const url = `${API_URL}/notification/api${path}`;

  let response = await fetch(url, {
    headers: authHeaders(),
  });

  if (response.status === 401) {
    await refresh();

    response = await fetch(url, {
      headers: authHeaders(),
    });
  }

  if (!response.ok) {
    const error = new Error(
      `notification api request failed: ${response.status}`
    );

    error.status = response.status;
    throw error;
  }

  return response.status === 204 ? null : response.json();
}