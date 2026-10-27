import { apiPost, apiGet } from "./apiClient";

const TRIP_PREFIX = "/route/api/trips";

/** POST para iniciar un viaje (Trip). */
export async function startTripApi(body) {
  return apiPost(`${TRIP_PREFIX}/start`, body);
}

/** GET estado del viaje para conductor (CanStart, CanEnd, EndConditionDetail). */
export async function getTripStatusApi(driverId) {
  return apiGet(`${TRIP_PREFIX}/status?driverId=${driverId}`);
}