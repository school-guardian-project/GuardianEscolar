import React, { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import { StyleSheet, View } from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import { FontAwesome5 } from "@expo/vector-icons";

const DEFAULT_FALLBACK_REGION = {
  latitude: 2.9273,
  longitude: -75.2819,
  latitudeDelta: 0.08,
  longitudeDelta: 0.08,
};

// Intervalo máximo permitido para considerar que la ubicación es reciente (ms)
const LOCATION_FRESHNESS_THRESHOLD_MS = 10000; // 10 segundos

// Velocidad mínima para considerar que el bus está en movimiento (km/h)
const MOVEMENT_SPEED_THRESHOLD = 1;

/**
 * Calcula el bearing (rumbo) entre dos puntos usando la fórmula del haversine.
 * Retorna un ángulo en grados (0-360) donde:
 * - 0° = Norte
 * - 90° = Este
 * - 180° = Sur
 * - 270° = Oeste
 */
function calculateBearing(lat1, lon1, lat2, lon2) {
  const toRad = Math.PI / 180;
  const dLon = (lon2 - lon1) * toRad;
  const y = Math.sin(dLon) * Math.cos(lat2 * toRad);
  const x =
    Math.cos(lat1 * toRad) * Math.sin(lat2 * toRad) -
    Math.sin(lat1 * toRad) * Math.cos(lat2 * toRad) * Math.cos(dLon);
  const bearing = (Math.atan2(y, x) * 180) / Math.PI;
  return (bearing + 360) % 360; // Normalizar a 0-360
}

/**
 * Determina si la ubicación es reciente comparando timestamps.
 */
function isLocationFresh(location) {
  if (!location) return false;

  const timestamp = Date.parse(
    location.receivedAt || location.gpsDateTime || location.dateTime || ""
  );

  if (!Number.isFinite(timestamp)) {
    // Si no hay timestamp, considerarlo reciente por defecto
    return true;
  }

  const now = Date.now();
  const age = now - timestamp;

  return age <= LOCATION_FRESHNESS_THRESHOLD_MS;
}

/**
 * Determina el color del icono basado en el estado GPS, antigüedad y movimiento.
 * Verde: GPS válido + ubicación reciente + bus en movimiento
 * Azul: GPS válido + ubicación reciente + bus detenido
 * Gris: GPS inválido o ubicación muy antigua (pérdida de señal)
 */
function getBusMarkerColor(location) {
  // Si no hay ubicación, usar gris
  if (!location) return "#9CA3AF";

  // Verificar estado GPS
  const gpsStatus = String(location.status).toUpperCase();
  const hasValidGps = gpsStatus === "GPS_VALID" || gpsStatus === "VALID";

  // Verificar si la ubicación es reciente
  const isFresh = isLocationFresh(location);

  // Si GPS es inválido o ubicación muy antigua, usar gris (pérdida de señal)
  if (!hasValidGps || !isFresh) {
    return "#9CA3AF";
  }

  // GPS válido + ubicación reciente: verificar si está en movimiento
  const speed = Number(location.speed) || 0;
  const isMoving = speed > MOVEMENT_SPEED_THRESHOLD;

  // Verde si está en movimiento, azul si está detenido
  return isMoving ? "#22C55E" : "#1A56DB";
}

/**
 * Determina el bearing (rumbo) que debe usar el icono.
 * Prioridad:
 * 1. Si hay movimiento: usar `course` del GPS o calcular desde posición anterior
 * 2. Si está detenido: mantener el último bearing válido
 */
function determineBearing(location, previousLocation, lastValidBearing) {
  if (!location) return lastValidBearing || 0;

  const speed = Number(location.speed) || 0;
  const isMoving = speed > MOVEMENT_SPEED_THRESHOLD;

  // Si está en movimiento y hay bearing disponible del GPS
  if (isMoving && Number.isFinite(Number(location.course))) {
    return Number(location.course);
  }

  // Si está en movimiento pero no hay course, intentar calcular desde posición anterior
  if (
    isMoving &&
    previousLocation &&
    Number.isFinite(Number(previousLocation.latitude)) &&
    Number.isFinite(Number(previousLocation.longitude)) &&
    Number.isFinite(Number(location.latitude)) &&
    Number.isFinite(Number(location.longitude))
  ) {
    const bearing = calculateBearing(
      Number(previousLocation.latitude),
      Number(previousLocation.longitude),
      Number(location.latitude),
      Number(location.longitude)
    );
    return bearing;
  }

  // Si está detenido, mantener el último bearing válido
  return lastValidBearing || 0;
}

const GpsMap = forwardRef(function GpsMap({ 
  location, 
  routeStops = [], 
  routeGeometry = [], 
  fallbackRegion = DEFAULT_FALLBACK_REGION 
}, ref) {
  const mapRef = useRef(null);
  const previousLocationRef = useRef(null);
  const mapReadyRef = useRef(false);
  const pendingRegionRef = useRef(null);
  const stopsRef = useRef([]);
  const lastValidBearingRef = useRef(0);

  useEffect(() => {
    const latitude = Number(location?.latitude);
    const longitude = Number(location?.longitude);

    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
      return;
    }

    const previous = previousLocationRef.current;
    const shouldUpdateRegion =
      !previous ||
      Math.abs(previous.latitude - latitude) > 0.0005 ||
      Math.abs(previous.longitude - longitude) > 0.0005;

    if (shouldUpdateRegion) {
      const nextRegion = {
        latitude,
        longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };

      if (mapReadyRef.current) {
        mapRef.current?.animateToRegion(nextRegion, 500);
      } else {
        pendingRegionRef.current = nextRegion;
      }
    }

    // SIEMPRE actualizar previousLocationRef para cálculos de bearing precisos
    previousLocationRef.current = {
      latitude,
      longitude,
    };

    // Actualizar bearing si hay movimiento
    const currentBearing = determineBearing(
      location,
      previousLocationRef.current,
      lastValidBearingRef.current
    );
    if (Number.isFinite(currentBearing)) {
      lastValidBearingRef.current = currentBearing;
    }
  }, [location]);

  // Mantener referencia de paradas para fitToCoordinates
  useEffect(() => {
    stopsRef.current = routeStops;
  }, [routeStops]);

  // Ajustar mapa a las paradas cuando cambien
  useEffect(() => {
    if (!mapReadyRef.current || routeStops.length === 0) return;
    mapRef.current?.fitToCoordinates(
      routeStops.map((stop) => ({
        latitude: stop.latitude,
        longitude: stop.longitude,
      })),
      {
        edgePadding: { top: 90, right: 40, bottom: 280, left: 40 },
        animated: true,
      },
    );
  }, [routeStops, mapReadyRef.current]);

  const hasLocation =
    location?.latitude != null &&
    location?.longitude != null &&
    location.latitude !== "" &&
    location.longitude !== "" &&
    Number.isFinite(Number(location?.latitude)) &&
    Number.isFinite(Number(location?.longitude));

  const markerCoordinate = hasLocation
    ? {
        latitude: Number(location.latitude),
        longitude: Number(location.longitude),
      }
    : null;

  // Determinar color y bearing del icono
  const busMarkerColor = getBusMarkerColor(location);
  const busRotation = determineBearing(
    location,
    previousLocationRef.current,
    lastValidBearingRef.current
  );

  useImperativeHandle(ref, () => ({
    centerOnLocation() {
      if (!markerCoordinate || !mapReadyRef.current) return;
      mapRef.current?.animateToRegion({
        ...markerCoordinate,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }, 500);
    },
    fitStopsOnMap() {
      if (!mapReadyRef.current || stopsRef.current.length === 0) return;
      mapRef.current?.fitToCoordinates(
        stopsRef.current.map((stop) => ({
          latitude: stop.latitude,
          longitude: stop.longitude,
        })),
        {
          edgePadding: { top: 90, right: 40, bottom: 280, left: 40 },
          animated: true,
        },
      );
    },
  }), [markerCoordinate]);

  return (
    <MapView
      ref={mapRef}
      style={styles.map}
      initialRegion={fallbackRegion}
      onMapReady={() => {
        mapReadyRef.current = true;
        const region = pendingRegionRef.current;
        if (region) {
          mapRef.current?.animateToRegion(region, 500);
          pendingRegionRef.current = null;
        }
        // Si hay paradas, encuadrarlas al cargar el mapa
        if (stopsRef.current.length > 0) {
          mapRef.current?.fitToCoordinates(
            stopsRef.current.map((stop) => ({
              latitude: stop.latitude,
              longitude: stop.longitude,
            })),
            {
              edgePadding: { top: 90, right: 40, bottom: 280, left: 40 },
              animated: true,
            },
          );
        }
      }}
      onError={(event) => console.error("[GpsMap] map error:", event.nativeEvent || event)}
      showsCompass
      showsMyLocationButton={false}
      showsScale={false}
    >
      {/* Trazo de la ruta (geometría vial OSRM) */}
      {routeGeometry.length >= 2 ? (
        <Polyline
          coordinates={routeGeometry}
          strokeColor="#1A56DB"
          strokeWidth={4}
        />
      ) : routeStops.length >= 2 ? (
        <Polyline
          coordinates={routeStops.map(({ latitude, longitude }) => ({
            latitude,
            longitude,
          }))}
          strokeColor="#B0C4DE"
          strokeWidth={2}
          lineDashPattern={[5, 5]}
        />
      ) : null}

      {/* Marcadores de paradas */}
      {routeStops.map((stop, index) => (
        <Marker
          key={stop.id}
          coordinate={{
            latitude: stop.latitude,
            longitude: stop.longitude,
          }}
          title={stop.name || `Parada ${index + 1}`}
          description={stop.address || undefined}
          tracksViewChanges={false}
        >
          <View style={styles.stopMarker}>
            <FontAwesome5 name="map-marker-alt" size={20} color="#1A56DB" />
          </View>
        </Marker>
      ))}

      {/* Bus en tiempo real (ms-gps) */}
      {markerCoordinate && (
        <Marker
          coordinate={markerCoordinate}
          title="Ubicación actual del bus"
          rotation={busRotation}
          anchor={{ x: 0.5, y: 0.5 }}
        >
          <View style={[styles.busMarker, { backgroundColor: busMarkerColor }]}>
            <FontAwesome5 name="bus" size={19} color="#FFFFFF" />
          </View>
        </Marker>
      )}
    </MapView>
  );
});

export default GpsMap;

const styles = StyleSheet.create({
  map: {
    flex: 1,
    width: "100%",
    height: "100%",
    zIndex: 0,
  },
  busMarker: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1A56DB",
    borderWidth: 3,
    borderColor: "#FFFFFF",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  stopMarker: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 2,
    borderColor: "#1A56DB",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
});