import { GPS_CONFIG } from "@core/config/gps";
import { apiRequestAt } from "./apiClient";

function normalizeGpsValue(value, fallback = null) {
  if (value === null || value === undefined || value === "") {
    return fallback;
  }

  return value;
}

export async function getCurrentVehicleLocation(
  imei = GPS_CONFIG.imei,
  baseUrl = GPS_CONFIG.baseUrl
) {
  if (!imei) {
    throw new Error("No se ha definido el IMEI del vehículo.");
  }

  if (!baseUrl) {
    throw new Error("No se ha configurado la URL base del backend GPS.");
  }

  const path = `/api/gps/devices/${encodeURIComponent(imei)}/location`;

  console.log("[GPS] Fetching:", path);

  // Kong exige el JWT en /api/gps: apiRequestAt agrega el Bearer, renueva el
  // token ante un 401 y corta la petición a los 15 s (sin ese corte, una
  // petición colgada detenía el polling de useGpsTracking).
  let payload;

  try {
    payload = await apiRequestAt(baseUrl, path, { method: "GET" }, true, true);
    console.log("[GPS] Location:", payload);
  } catch (error) {
    console.error("[GPS] Request failed:", error);

    if (error?.status) {
      throw new Error(
        error.data?.message || `Error del backend GPS (${error.status}).`
      );
    }

    if (error instanceof SyntaxError) {
      throw new Error("La respuesta del backend GPS no es válida.");
    }

    throw new Error("No se pudo conectar con el backend GPS.");
  }

  if (!payload) {
    throw new Error("No hay ubicación disponible.");
  }

  const latitude = Number(payload.latitude);
  const longitude = Number(payload.longitude);

  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    throw new Error("La ubicación recibida del GPS es inválida.");
  }

  return {
    imei: normalizeGpsValue(payload.imei, imei),
    latitude,
    longitude,
    speed: Number(normalizeGpsValue(payload.speed, 0)),
    course: Number(normalizeGpsValue(payload.course, 0)),
    status: normalizeGpsValue(payload.status, "UNKNOWN"),
    positionType: normalizeGpsValue(payload.positionType, null),
    timestampStatus: normalizeGpsValue(payload.timestampStatus, null),
    dateTime: normalizeGpsValue(payload.dateTime, null),
    gpsDateTime: normalizeGpsValue(payload.gpsDateTime, null),
    receivedAt: normalizeGpsValue(payload.receivedAt, null),
  };
}
