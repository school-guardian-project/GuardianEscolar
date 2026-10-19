/**
 * Traduce el rechazo del backend al reportar un incidente (FR-8.1) a una clave
 * de i18n.
 *
 * ReportIncidentService devuelve 409 con un mensaje fijo; se mapea ese mensaje
 * para poder decir que paso de verdad (sin viaje activo, tipo desconocido,
 * detalle muy largo). Cualquier otro codigo cae en el mensaje generico, de modo
 * que un error nuevo nunca deja al conductor sin texto.
 */
const CONFLICT_KEYS = {
  "Driver has no active trip": "incidents.noTrip",
  "Unknown incident type": "incidents.unknownType",
  "Incident description is too long": "incidents.descriptionTooLong",
};

export function incidentErrorKey(error) {
  const status = error && typeof error === "object" ? error.status : undefined;

  if (status === 409) {
    const message =
      error.data && typeof error.data === "object" ? error.data.message : undefined;
    return CONFLICT_KEYS[message] ?? "incidents.failed";
  }

  if (status === 403) {
    return "incidents.forbidden";
  }

  if (status === 503) {
    return "incidents.unavailable";
  }

  return "incidents.failed";
}
