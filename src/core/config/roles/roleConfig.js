/**
 * Configuración por rol para la vista principal (MainPage) y el perfil.
 * Cada rol declara qué componentes se muestran, y MainPage/Profile los
 * renderizan según esta configuración.
 */
export const roleConfig = {
  student: {
    topBar: {
      showNotifications: true,
    },
    card: {
      showQR: true,
      // "activate": el estudiante muestra su QR; "scan": el conductor lo escanea.
      qrMode: "activate",
      showIncidentReport: false,
    },
    MapMarkers: {
      showRouteStops: true,
      showStudentMarker: true,
      showDriverMarker: false,
      showGeofence: true,
    },
    profile: {
      showFamily: true,
    },
  },
  driver: {
    topBar: {
      showNotifications: true,
    },
    card: {
      showQR: true,
      qrMode: "scan",
      showIncidentReport: true,
    },
    MapMarkers: {
      showRouteStops: true, // Conductor ve paradas + sugerencia OSRM
      showStudentMarker: false,
      showDriverMarker: true,
      showGeofence: false,
    },
    profile: {
      showFamily: false,
    },
  },
  parent: {
    topBar: {
      showNotifications: true,
    },
    card: {
      showQR: false,
      qrMode: null,
      showIncidentReport: false,
    },
    MapMarkers: {
      showRouteStops: true, // Parent ve paradas de sus hijos en el mapa
      showStudentMarker: true,
      showDriverMarker: true,
      showGeofence: true,
    },
    profile: {
      showFamily: true,
    },
  },
  // Admin (1) y SuperAdmin (5) del catálogo Iam.Role: perfil de gestión.
  // Sin QR de estudiante ni reporte de incidente, y sin "Mi familia".
  admin: {
    topBar: {
      showNotifications: true,
    },
    card: {
      showQR: false,
      qrMode: null,
      showIncidentReport: false,
    },
    MapMarkers: {
      showRouteStops: true,
      showStudentMarker: false,
      showDriverMarker: false,
      showGeofence: false,
    },
    profile: {
      showFamily: false,
    },
  },
};

// roleId del JWT (catálogo Iam.Role) -> clave local de roleConfig.
const ROLE_ID_TO_KEY = { 1: "admin", 2: "student", 3: "driver", 4: "parent", 5: "admin" };

export function roleKeyFromRoleId(roleId) {
  return ROLE_ID_TO_KEY[roleId] ?? "student";
}