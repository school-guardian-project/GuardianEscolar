import { apiGet } from "./apiClient";

/**
 * Lista las marcas de vehículos disponibles
 * @returns {Promise<Array<{id, name}>>}
 */
export async function listBrands() {
  return apiGet("/fleet/api/vehicle-types/brands");
}

/**
 * Lista los modelos de vehículos, opcionalmente filtrados por marca
 * @param {number} [brandId] - ID de la marca (opcional)
 * @returns {Promise<Array<{id, name, brandId, brandName}>>}
 */
export async function listModels(brandId) {
  const query = brandId ? `?brandId=${brandId}` : "";
  return apiGet(`/fleet/api/vehicle-types/models${query}`);
}
