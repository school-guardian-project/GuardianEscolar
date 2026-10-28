const STATUS_BY_NUMBER = ["NotStarted", "ReadyToStart", "InProgress", "ReadyToEnd", "Ended"];

const pick = (data, key) => data?.[key] ?? data?.[key.charAt(0).toLowerCase() + key.slice(1)];

/**
 * ms-route serializa en camelCase y el enum de estado como número; aquí se
 * acepta también PascalCase y texto para no depender de la configuración JSON.
 */
export function normalizeTripStatus(data) {
  if (!data) return null;
  const rawStatus = pick(data, "Status");
  const status = typeof rawStatus === "number" ? STATUS_BY_NUMBER[rawStatus] : rawStatus;
  return {
    status: status ?? "NotStarted",
    canStart: pick(data, "CanStart") ?? false,
    canEnd: pick(data, "CanEnd") ?? false,
    endConditionDetail: pick(data, "EndConditionDetail") ?? null,
    tripId: pick(data, "TripId") ?? null,
    direction: pick(data, "Direction") ?? null,
    scheduleStartTime: pick(data, "ScheduleStartTime") ?? null,
    nextScheduleTime: pick(data, "NextScheduleTime") ?? null,
  };
}

export function localTripState(trip) {
  if (trip.status === "Ended") return "ended";
  if (trip.status === "InProgress" || trip.status === "ReadyToEnd") return "active";
  if (trip.status === "ReadyToStart" || trip.canStart) return "ready_to_start";
  return "idle";
}
