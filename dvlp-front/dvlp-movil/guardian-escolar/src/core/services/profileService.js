import { apiGet } from "./apiClient";

/**
 * Obtiene el perfil completo del usuario autenticado
 * @returns {Promise<{profileId, personId, email, roleId, roleName, campusId}>}
 */
export async function getProfile() {
  return apiGet("/api/v1/auth/profile");
}
