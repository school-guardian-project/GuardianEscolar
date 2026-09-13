// [MOCK-API] Config temporal para json-server. Para desactivar: ENABLED=false o borrar carpeta api-mock.
// Flujo: Cliente (Angular) -> Backend (json-server :3000) -> DB (db.json)
export const MOCK_API_CONFIG = {
  baseUrl: 'http://localhost:3000',
  enabled: true,
  timeoutMs: 8000,
} as const;

export const MOCK_ENDPOINTS = {
  permissions: '/permissions',
  profiles: '/profiles',
  roles: '/roles',
  persons: '/persons',
  families: '/families',
  buses: '/buses',
  routes: '/routes',
  stops: '/stops',
  boardings: '/boardings',
  alerts: '/alerts',
  schools: '/schools',
  routeExecutions: '/route-executions',
  gpsDevices: '/gps-devices',
} as const;
