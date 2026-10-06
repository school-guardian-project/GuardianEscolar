import { getFleetApi, postFleetApi, putFleetApi, deleteFleetApi } from "./fleetApi";

const PREFIX = "/buses";

/**
 * Lista los buses registrados.
 * @returns {Promise<Array<{id, plate, campuseId, driverName, brand, model}>>}
 */
export async function listBuses() {
  return getFleetApi(PREFIX);
}

/**
 * Obtiene el detalle de un bus.
 * @param {string} id
 * @returns {Promise<{id, plate, campuseId, driverName, brand, model, soatValidity, gpsDeviceId, capacity, modelId, status}>}
 */
export async function getBus(id) {
  return getFleetApi(`${PREFIX}/${id}`);
}

/**
 * Crea un bus. Contrato real de ms-fleet (POST /fleet/api/buses):
 * body { campuseId, soatValidity, capacity, plate, modelId } -> Ok(busId)
 *
 * `gpsDeviceId` se omite a propósito: ms-fleet lo valida con
 * GpsDeviceExistsAsync contra un proveedor api/gps-devices/{id}/exists
 * que no existe en el codebase (y cuyo HttpClient no tiene BaseAddress),
 * asi que cualquier Guid fallaria igual. El alta quedará bloqueada por el
 * backend hasta que exista ese proveedor.
 *
 * @param {{campuseId: string, soatValidity: string, capacity: number, plate: string, modelId: number}} payload
 * @returns {Promise<string>} busId
 */
export async function createBus(payload) {
  return postFleetApi(PREFIX, payload);
}

/**
 * Actualiza un bus (PUT /fleet/api/buses/{id}).
 * @param {string} id
 * @param {{campuseId: string, soatValidity: string, capacity: number, modelId: number}} payload
 */
export async function updateBus(id, payload) {
  return putFleetApi(`${PREFIX}/${id}`, payload);
}

/** Elimina un bus. */
export async function removeBus(id) {
  return deleteFleetApi(`${PREFIX}/${id}`);
}

/** Asigna un conductor a un bus. */
export async function assignDriver(busId, profileId) {
  return putFleetApi(`${PREFIX}/${busId}/driver`, { profileId });
}

/** Desasigna el conductor de un bus. */
export async function unassignDriver(busId) {
  return deleteFleetApi(`${PREFIX}/${busId}/driver`);
}