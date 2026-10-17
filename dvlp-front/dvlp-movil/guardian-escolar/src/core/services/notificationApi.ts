import { apiGet, apiPost } from "./apiClient";
import type {
  BoardingType,
  Credential,
  GuardianNotification,
  IncidentResponse,
  RegisterDeviceRequest,
  ReportIncidentRequest,
} from "@core/types/notifications";

/**
 * Configuración de ms-notification. El prefijo y las rutas salen de las
 * variables EXPO_PUBLIC_NOTIFICATION_*: acá no vive ningún valor del entorno.
 */
const PREFIX = process.env.EXPO_PUBLIC_NOTIFICATION_API_PREFIX;
const SCAN = process.env.EXPO_PUBLIC_NOTIFICATION_SCAN_PATH;
const DEVICES = process.env.EXPO_PUBLIC_NOTIFICATION_DEVICES_PATH;
const CREDENTIAL = process.env.EXPO_PUBLIC_NOTIFICATION_CREDENTIAL_PATH;
const GUARDIAN = process.env.EXPO_PUBLIC_NOTIFICATION_GUARDIAN_PATH;
const INCIDENTS = process.env.EXPO_PUBLIC_NOTIFICATION_INCIDENTS_PATH;

/** GET a ms-notification. El camino lo aporta el llamador. */
export function getNotificationApi(path: string | undefined): Promise<unknown> {
  return apiGet(`${PREFIX}${path}`);
}

/** POST a ms-notification. El camino lo aporta el llamador. */
export function postNotificationApi(
  path: string | undefined,
  body: unknown
): Promise<unknown> {
  return apiPost(`${PREFIX}${path}`, body);
}

/** Credencial firmada del perfil autenticado, para renderizar el QR. */
export async function generateCredential(): Promise<Credential> {
  return (await getNotificationApi(CREDENTIAL)) as Credential;
}

/** Registra el escaneo de un QR. El backend resuelve viaje, parada y estudiante. */
export async function scanCredential(
  qrToken: string,
  boardingType: BoardingType
): Promise<void> {
  await postNotificationApi(SCAN, { qrToken, boardingType });
}

/** Alta idempotente del dispositivo para recibir push. */
export async function registerDevice(
  request: RegisterDeviceRequest
): Promise<void> {
  await postNotificationApi(DEVICES, request);
}

/** Alertas dirigidas al perfil autenticado. */
export async function getGuardianNotifications(): Promise<GuardianNotification[]> {
  return (await getNotificationApi(GUARDIAN)) as GuardianNotification[];
}

/**
 * Reporta un incidente o emergencia durante el viaje (FR-8.1).
 *
 * El servidor saca el viaje del conductor autenticado y resuelve solo quienes
 * deben enterarse (FR-8.2), asi que aqui no se manda ni viaje ni destinatarios.
 */
export async function reportIncident(
  request: ReportIncidentRequest
): Promise<IncidentResponse> {
  return (await postNotificationApi(INCIDENTS, request)) as IncidentResponse;
}
