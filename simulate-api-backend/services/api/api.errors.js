// [MOCK-API] Errores tipados — evita filtrar internals al usuario (seguridad)
// Uso: throw new ValidationError(...); throw ApiError.fromResponse(res, data)

export class ApiError extends Error {
  /**
   * @param {string} message mensaje seguro para UI
   * @param {number|null} status HTTP status
   * @param {any} data payload crudo (solo para logs, no mostrar en UI)
   */
  constructor(message, status = null, data = null) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }

  static fromResponse(status, data) {
    // Mapeo seguro: no exponer detalles de DB
    const map = {
      400: "Solicitud inválida. Verifica los datos ingresados.",
      401: "No autorizado. Inicia sesión nuevamente.",
      403: "No tienes permisos para esta acción.",
      404: "Recurso no encontrado.",
      408: "Tiempo de espera agotado. Intenta de nuevo.",
      429: "Demasiadas solicitudes. Espera un momento.",
      500: "Error interno. Intenta más tarde.",
    };
    const msg = map[status] || `Error inesperado (${status}). Intenta más tarde.`;
    return new ApiError(msg, status, data);
  }

  static network(msg = "Sin conexión. Verifica tu red.") {
    return new ApiError(msg, null, null);
  }

  static timeout() {
    return new ApiError("La petición tardó demasiado. Intenta de nuevo.", 408, null);
  }
}

export class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = "ValidationError";
  }
}
