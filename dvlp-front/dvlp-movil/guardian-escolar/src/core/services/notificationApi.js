import { apiGet, apiPost } from "./apiClient";

const PREFIX = "/notification/api";

/** POST a ms-notification a través del API Gateway. */
export async function postNotificationApi(path, body) {
  return apiPost(`${PREFIX}${path}`, body);
}

/** GET a ms-notification a través del API Gateway. */
export async function getNotificationApi(path) {
  return apiGet(`${PREFIX}${path}`);
}