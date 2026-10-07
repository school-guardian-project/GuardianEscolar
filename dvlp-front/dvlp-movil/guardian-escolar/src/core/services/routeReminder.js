import * as Notifications from "expo-notifications";
import i18n from "@core/i18n/i18n";

// Identificador fijo: reprogramar con el mismo id no duplica recordatorios.
const REMINDER_ID = "route-start-reminder";
const CHANNEL_ID = "default";

// La hora llega del backend como ISO con offset local de la ruta
// (ej. "2026-10-08T06:00:00-05:00"), por eso se lee directo del string
// en vez de usar getHours() (que convertiria a la zona del dispositivo).
function formatFireTime(iso) {
  const match = /T(\d{2}):(\d{2})/.exec(String(iso));
  if (!match) return "";

  const hour24 = Number(match[1]);
  const minute = match[2];
  const period = hour24 < 12 ? i18n.t("reminder.am") : i18n.t("reminder.pm");
  const hour12 = hour24 % 12 === 0 ? 12 : hour24 % 12;

  return `${hour12}:${minute} ${period}`;
}

export async function cancelRouteStartReminder() {
  try {
    await Notifications.cancelScheduledNotificationAsync(REMINDER_ID);
  } catch {
    // Sin permisos o sin recordatorio previo: no hay nada que cancelar.
  }
}

/**
 * Programa una notificacion local para la hora de inicio de la ruta.
 * Devuelve true si quedo programada; cancela cualquier recordatorio
 * anterior primero (incluido el de otro dia).
 */
export async function scheduleRouteStartReminder(startsAt, routeName) {
  await cancelRouteStartReminder();

  if (!startsAt) return false;

  const fireDate = new Date(startsAt);
  if (Number.isNaN(fireDate.getTime()) || fireDate.getTime() <= Date.now()) {
    return false;
  }

  try {
    const { status } = await Notifications.getPermissionsAsync();
    if (status !== "granted") return false;

    await Notifications.scheduleNotificationAsync({
      identifier: REMINDER_ID,
      content: {
        title: i18n.t("reminder.title"),
        body: routeName
          ? i18n.t("reminder.message", { name: routeName, time: formatFireTime(startsAt) })
          : i18n.t("reminder.messageNoName", { time: formatFireTime(startsAt) }),
        data: { type: "ROUTE_START", startsAt },
        sound: true,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: fireDate,
        channelId: CHANNEL_ID,
      },
    });
    return true;
  } catch (error) {
    console.warn("No se pudo programar el recordatorio de ruta:", error);
    return false;
  }
}
