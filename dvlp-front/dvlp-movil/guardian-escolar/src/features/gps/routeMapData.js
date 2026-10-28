export function toValidCoordinate(location) {
  const rawLatitude = location?.latitude;
  const rawLongitude = location?.longitude;
  if (
    rawLatitude == null || String(rawLatitude).trim() === "" ||
    rawLongitude == null || String(rawLongitude).trim() === ""
  ) return null;

  const latitude = Number(rawLatitude);
  const longitude = Number(rawLongitude);
  if (
    !Number.isFinite(latitude) || !Number.isFinite(longitude) ||
    latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180
  ) return null;

  return { latitude, longitude };
}

export function normalizeStops(route) {
  return (Array.isArray(route?.stops) ? route.stops : [])
    .map((stop, originalIndex) => {
      const coordinate = toValidCoordinate(stop);
      if (!coordinate) return null;
      const order = Number(stop.orderSequence);
      return {
        ...coordinate,
        id: stop.id ?? originalIndex,
        originalIndex,
        name: stop.name ?? "",
        address: stop.address ?? "",
        orderSequence: Number.isFinite(order) ? order : originalIndex + 1,
      };
    })
    .filter(Boolean)
    .sort((a, b) => a.orderSequence - b.orderSequence);
}

export function normalizeGeometry(suggestion) {
  const points = suggestion?.geometry?.points ?? suggestion?.geometry?.Points;
  if (!Array.isArray(points)) return [];
  return points.map(point => toValidCoordinate({
    latitude: point?.latitude ?? point?.Latitude,
    longitude: point?.longitude ?? point?.Longitude,
  })).filter(Boolean);
}
