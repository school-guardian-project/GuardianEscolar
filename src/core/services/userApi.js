import { apiGet } from "./apiClient";

// ms-user-management publica sus rutas bajo api/v1 (igual que la web).
const PREFIX = "/user/api/v1";

/** GET a ms-user-management a través del API Gateway. */
export async function getUserApi(path) {
  return apiGet(`${PREFIX}${path}`);
}