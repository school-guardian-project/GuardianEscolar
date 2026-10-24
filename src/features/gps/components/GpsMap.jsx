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
      previousLocationRef.current = {
        latitude,
        longitude,
      };
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
          rotation={Number(location.course) || 0}
          anchor={{ x: 0.5, y: 0.5 }}
        >
          <View style={styles.busMarker}>
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