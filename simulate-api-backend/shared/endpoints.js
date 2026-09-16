// [SIMULATE-API-BACKEND] Endpoints compartidos — unifica móvil y web
// Según openapi.json (37 paths)

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

// Mapeo de roles: nombre del rol -> appRole
export const ROLE_MAP = {
  admin: "admin",
  student: "student",
  parent: "father",
  driver: "driver",
};

// Mapeo deRoleId a tipo de entidad
export const ROLE_TYPE_MAP = {
  1: "admins",
  2: "estudiante",
  3: "acudiente",
  4: "conductor",
};
