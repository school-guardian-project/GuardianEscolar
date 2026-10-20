/**
 * Tipos de incidente que el conductor puede reportar (FR-8.1).
 *
 * Los `alertTypeId` son los de Notification.AlertType sembrado por
 * database/ms-notification-db/02-dml/00-inserts/006-insert-incident-alert-types.sql
 * (21..24, justo despues de los 20 tipos operativos). El backend resuelve el
 * tipo contra ese catalogo y rechaza cualquier id que no exista, asi que si la
 * migracion cambia, esta lista tiene que cambiar con ella.
 */
export const INCIDENT_TYPES = [
  { alertTypeId: 21, labelKey: "incidents.typeAccident" },
  { alertTypeId: 22, labelKey: "incidents.typeMedical" },
  { alertTypeId: 23, labelKey: "incidents.typeBreakdown" },
  { alertTypeId: 24, labelKey: "incidents.typeSecurity" },
];

/** Limite de Notification.Alert.Description ensanchado en FR-8.1. */
export const MAX_INCIDENT_DESCRIPTION = 500;

/**
 * Clave de i18n del tipo de incidente, o null si el alertTypeId no pertenece
 * al catalogo de incidentes (FR-8.2).
 *
 * La lista del acudiente (GET /notifications/guardian) mezcla alertas de
 * abordaje, descenso e incidente en el mismo flujo; el alertTypeId es lo unico
 * que distingue a un incidente, porque su Alert no trae boardingType.
 */
export function incidentTypeLabelKey(alertTypeId) {
  const type = INCIDENT_TYPES.find((item) => item.alertTypeId === alertTypeId);
  return type ? type.labelKey : null;
}
