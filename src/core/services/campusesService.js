import { apiGet } from "./apiClient";

/**
 * Lista los campuses de una escuela
 * @param {string} schoolId - ID de la escuela
 * @returns {Promise<Array<{id, name, address}>>}
 */
export async function listCampuses(schoolId) {
  return apiGet(`/school-management/api/v1/schools/${schoolId}/campuses`);
}
