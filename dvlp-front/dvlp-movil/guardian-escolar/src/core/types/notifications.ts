export type BoardingType = "ON_BOARD" | "OFF_BOARD";

export interface ScanRequest {
  qrToken: string;
  boardingType: BoardingType;
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

export interface ApiError extends Error {
  status?: number;
  data?: unknown;
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof Error && "status" in error;
}
