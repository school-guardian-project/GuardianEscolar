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
