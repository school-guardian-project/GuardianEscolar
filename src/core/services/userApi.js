import { apiGet } from "./apiClient";

const PREFIX = "/user/api";

/** GET a ms-user-management a través del API Gateway. */
export async function getUserApi(path) {
  return apiGet(`${PREFIX}${path}`);
}