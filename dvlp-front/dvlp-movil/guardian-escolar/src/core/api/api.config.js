// [MOCK-API] Config temporal para json-server. Para desactivar: ENABLED=false o borrar carpeta src/core/api
// Buenas prácticas: env-aware, timeout razonable, sin secretos, feature flag explícito.

// En Expo, usa EXPO_PUBLIC_API_URL para override sin tocar código (ej. staging)
const ENV_URL = typeof process !== "undefined" ? process.env?.EXPO_PUBLIC_API_URL : undefined;

export const API_CONFIG = {
  // json-server :3000 (ver school-guardian/json-server/docker-compose.yml), docs Scalar :3001
  BASE_URL: ENV_URL || "http://localhost:3000",
  ENABLED: true,
  TIMEOUT_MS: 8000,
  FALLBACK_TO_MOCK: true,
  // Cache 60s para GET (api.cache.js)
  CACHE_TTL_MS: 60_000,
};

// Endpoints según openapi.json (37 paths) — centralizado para DRY
export const ENDPOINTS = {
  permissions: "/permissions",
  permissionRoles: "/permission-roles",
  profiles: "/profiles",
  roles: "/roles",
  persons: "/persons",
  families: "/families",
  familyMembers: "/family-members",
  buses: "/buses",
  routes: "/routes",
  routeStops: "/route-stops",
  stops: "/stops",
  boardings: "/boardings",
  alerts: "/alerts",
  alertTypes: "/alert-types",
  audits: "/audits",
  logErrors: "/log-errors",
  schools: "/schools",
  schoolCampuses: "/school-campuses",
  routeBusAssignments: "/route-bus-assignments",
  routeStudentAssignments: "/route-student-assignments",
  routeExecutions: "/route-executions",
  gpsDevices: "/gps-devices",
  gpsLocations: "/gps-locations",
  driverAssignments: "/driver-assignments",
  driverLicenses: "/driver-licenses",
  passwordPolicies: "/password-policies",
  securitySettings: "/security-settings",
  sessionProfiles: "/session-profiles",
};
