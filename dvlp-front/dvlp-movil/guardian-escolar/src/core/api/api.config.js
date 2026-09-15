// [MOCK-API] Config temporal para json-server. Para desactivar: ENABLED=false o borrar carpeta src/core/api
// Buenas prácticas: env-aware, timeout razonable, sin secretos, feature flag explícito.

// En Expo, usa EXPO_PUBLIC_API_URL para override sin tocar código (ej. staging)
// Auto-detecta IP del host en físico para no tener que escribir la URL larga cada vez
function getAutoHostUrl() {
  try {
    // Expo Go expone hostUri como "10.3.232.153:19000" o "192.168.x.x:8081"
    const { default: Constants } = require("expo-constants");
    const hostUri = Constants.expoConfig?.hostUri || Constants.manifest?.hostUri || Constants.manifest2?.extra?.expoGo?.hostUri;
    if (hostUri) {
      const host = hostUri.split(":")[0];
      if (host && host !== "localhost" && host !== "127.0.0.1") return `http://${host}:3000`;
    }
  } catch {}
  return null;
}

const ENV_URL = typeof process !== "undefined" ? process.env?.EXPO_PUBLIC_API_URL : undefined;
const AUTO_URL = getAutoHostUrl();

export const API_CONFIG = {
  // json-server :3000 (ver school-guardian/json-server/docker-compose.yml), docs Scalar :3001
  // Prioridad: ENV_URL > IP auto-detectada > localhost (emulador usa 10.0.2.2, físico usa IP)
  BASE_URL: ENV_URL || AUTO_URL || "http://localhost:3000",
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
