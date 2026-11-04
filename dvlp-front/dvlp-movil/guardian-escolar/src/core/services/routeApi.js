import { apiGet, apiPost, apiPut, apiDelete } from "./apiClient";

const PREFIX = "/route/api";

/** GET a ms-route a través del API Gateway. */
export async function getRouteApi(path) {
  return apiGet(`${PREFIX}${path}`);
}

/** POST a ms-route a través del API Gateway. */
export async function postRouteApi(path, routeData) {
  const body = {
    ...routeData,
    daysOfWeek: routeData.daysOfWeek ?? ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
  };
  return apiPost(`${PREFIX}${path}`, body);
}

/** PUT a ms-route a través del API Gateway. */
export async function putRouteApi(path, routeData) {
  const body = {
    ...routeData,
    daysOfWeek: routeData.daysOfWeek ?? ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
  };
  return apiPut(`${PREFIX}${path}`, body);
}

/** DELETE a ms-route a través del API Gateway. */
export async function deleteRouteApi(path) {
  return apiDelete(`${PREFIX}${path}`);
}

/** GET sugerencia de ruta (geometría vial) a través del API Gateway. */
export async function getRouteSuggestionApi(routeId) {
  return getRouteApi(`/routes/${routeId}/suggestion`);
}