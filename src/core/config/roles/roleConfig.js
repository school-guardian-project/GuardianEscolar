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
      showIncidentReport: true,
    },
    MapMarkers: {
      showRouteStops: true,
      showStudentMarker: false,
      showDriverMarker: true,
      showGeofence: false,
    },
    profile: {
      showFamily: false,
    },
  },
  father: {
    topBar: {
      showNotifications: true,
    },
    card: {
      showQR: false,
      showIncidentReport: false,
    },
    MapMarkers: {
      showRouteStops: true,
      showStudentMarker: true,
      showDriverMarker: true,
      showGeofence: true,
    },
    profile: {
      showFamily: true,
    },
  },
};

// roleId del JWT (catálogo Iam.Role) -> clave local de roleConfig.
const ROLE_ID_TO_KEY = { 2: "student", 3: "driver", 4: "father" };

export function roleKeyFromRoleId(roleId) {
  return ROLE_ID_TO_KEY[roleId] ?? "student";
}
