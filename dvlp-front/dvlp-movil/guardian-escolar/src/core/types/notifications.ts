export type BoardingType = "ON_BOARD" | "OFF_BOARD";

export interface ScanRequest {
  qrToken: string;
}

/** Respuesta de `POST /notifications/scan` (FR-4.1). */
export interface ScanResponse {
  boardingId: string;
  alertId: string;
  parentsNotified: number;
  /** true cuando el movimiento ya estaba registrado y no se volvió a notificar. */
  alreadyProcessed: boolean;
  /** Tipo resuelto por el backend (el cliente no envía el tipo de movimiento). */
  boardingType?: BoardingType | null;
}

export interface Credential {
  qrToken: string;
  expiresAt: string;
}

export interface RegisterDeviceRequest {
  /** Token de Expo Push. */
  expoToken: string;
}

export interface GuardianAlertDetail {
  id: string;
  description?: string | null;
  dateTime: string;
  alertTypeId: number;
}

export interface GuardianNotification {
  id: string;
  alertId: string;
  dateTimeRead: string;
  boardingType?: BoardingType | null;
  alert: GuardianAlertDetail;
}

/** Cuerpo del reporte de incidente (FR-8.1). El `alertTypeId` sale del catalogo. */
export interface ReportIncidentRequest {
  alertTypeId: number;
  description?: string;
}

/** Respuesta de `POST /notifications/incidents`: a quien le quedo el registro. */
export interface IncidentResponse {
  alertId: string;
  routeExecutionId: string;
  studentsOnBoard: number;
  recipientsNotified: number;
}

export interface ApiError extends Error {
  status?: number;
  data?: unknown;
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof Error && "status" in error;
}
