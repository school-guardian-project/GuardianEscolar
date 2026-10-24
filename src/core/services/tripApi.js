import { apiPost } from "./apiClient";

const PREFIX = "/trip/api";

/** POST para iniciar un viaje (Trip). */
export async function startTripApi(body) {
  return apiPost(`${PREFIX}/start`, body);
}
