import { GPS_CONFIG } from "@core/config/gps";

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

  const url = `${baseUrl.replace(/\/+$/, "")}/api/gps/devices/${encodeURIComponent(
    imei
  )}/location`;

  console.log("[GPS] Fetching:", url);

  let response;

  try {
    response = await fetch(url);
    console.log("[GPS] Response:", response.status);
  } catch (error) {
    console.error("[GPS] Network error:", error);
    throw new Error("No se pudo conectar con el backend GPS.");
  }

  let payload = null;

  const responseText = await response.text();

  if (responseText) {
    try {
      payload = JSON.parse(responseText);
      console.log("[GPS] Location:", payload);
    } catch (error) {
      console.error("[GPS] Invalid JSON:", responseText);
      throw new Error("La respuesta del backend GPS no es válida.");
    }
  }

  if (!response.ok) {
    const errorMessage =
      payload && typeof payload === "object" && payload.message
        ? payload.message
        : `Error del backend GPS (${response.status}).`;

    throw new Error(errorMessage);
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
