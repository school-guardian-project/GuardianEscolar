import { apiGet, apiPost, apiPut, apiDelete } from "./apiClient";

const PREFIX = "/fleet/api";

/** GET a ms-fleet a través del API Gateway. */
export async function getFleetApi(path) {
  return apiGet(`${PREFIX}${path}`);
}

/** POST a ms-fleet a través del API Gateway. */
export async function postFleetApi(path, body) {
  return apiPost(`${PREFIX}${path}`, body);
}

/** PUT a ms-fleet a través del API Gateway. */
export async function putFleetApi(path, body) {
  return apiPut(`${PREFIX}${path}`, body);
}

/** DELETE a ms-fleet a través del API Gateway. */
export async function deleteFleetApi(path) {
  return apiDelete(`${PREFIX}${path}`);
}