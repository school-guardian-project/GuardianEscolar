// [MOCK-API] Config temporal para json-server. Para desactivar: ENABLED=false o borrar carpeta api-mock.
// Flujo: Cliente -> Backend (json-server) -> DB — ver .env.example (NG_APP_API_URL)
function getApiBaseUrl(): string {
  const envUrl = (() => { try { return (window as any)?.__env?.NG_APP_API_URL; } catch { return undefined; } })();
  if (envUrl) return envUrl;
  try {
    const host = typeof window !== 'undefined' ? window.location.hostname : '';
    if (host && host !== 'localhost' && host !== '127.0.0.1') return `http://${host}:3000`;
  } catch {}
  return 'http://localhost:3000';
}
export const MOCK_API_CONFIG = {
  baseUrl: getApiBaseUrl(),
  enabled: true,
  timeoutMs: 8000,
} as const;

export const MOCK_ENDPOINTS = {
  permissions: '/permissions',
  profiles: '/profiles',
  roles: '/roles',
  persons: '/persons',
  families: '/families',
  familyMembers: '/family-members',
  buses: '/buses',
  routes: '/routes',
  routeStops: '/route-stops',
  stops: '/stops',
  boardings: '/boardings',
  alerts: '/alerts',
  schools: '/schools',
  routeBusAssignments: '/route-bus-assignments',
  routeStudentAssignments: '/route-student-assignments',
  driverAssignments: '/driver-assignments',
  routeExecutions: '/route-executions',
  gpsDevices: '/gps-devices',
  driverLicenses: '/driver-licenses',
} as const;
