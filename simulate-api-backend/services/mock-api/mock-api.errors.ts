// [MOCK-API] Errores tipados para Angular — mismo contrato que móvil
export class MockApiError extends Error {
  constructor(
    message: string,
    public status: number | null = null,
    public data: unknown = null
  ) {
    super(message);
    this.name = 'MockApiError';
  }
  static fromStatus(status: number, data: unknown): MockApiError {
    const map: Record<number, string> = {
      400: 'Solicitud inválida.',
      401: 'No autorizado.',
      403: 'Sin permisos.',
      404: 'Recurso no encontrado.',
      408: 'Tiempo de espera agotado.',
      429: 'Demasiadas solicitudes.',
      500: 'Error interno.',
    };
    return new MockApiError(map[status] ?? `Error ${status}`, status, data);
  }
  static network(msg = 'Sin conexión.'): MockApiError {
    return new MockApiError(msg, null, null);
  }
  static timeout(): MockApiError {
    return new MockApiError('Tiempo de espera agotado.', 408, null);
  }
}
export class MockValidationError extends Error {
  override name = 'MockValidationError';
}
