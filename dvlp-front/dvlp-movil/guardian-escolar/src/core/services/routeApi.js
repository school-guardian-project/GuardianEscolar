import { apiGet, apiPost, apiPut, apiDelete } from "./apiClient";

const PREFIX = "/route/api";

/** GET a ms-route a través del API Gateway. */
export async function getRouteApi(path) {
  return apiGet(`${PREFIX}${path}`);
}

/** POST a ms-route a través del API Gateway. */
export async function postRouteApi(path, body) {
  return apiPost(`${PREFIX}${path}`, body);
}

/** PUT a ms-route a través del API Gateway. */
export async function putRouteApi(path, body) {
  return apiPut(`${PREFIX}${path}`, body);
}

/** DELETE a ms-route a través del API Gateway. */
export async function deleteRouteApi(path) {
  return apiDelete(`${PREFIX}${path}`);
}