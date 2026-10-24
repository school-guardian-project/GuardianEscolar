import { apiPost } from "./apiClient";

const PREFIX = "/route/api/trips";

/** POST para iniciar un viaje (Trip). */
export async function startTripApi(body) {
  return apiPost(`${PREFIX}/start`, body);
}
