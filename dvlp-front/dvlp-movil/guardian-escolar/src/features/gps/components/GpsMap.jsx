import React, { useEffect, useRef } from "react";
import { StyleSheet } from "react-native";
import MapView, { Marker } from "react-native-maps";

const DEFAULT_FALLBACK_REGION = {
  latitude: 2.9273,
  longitude: -75.2819,
  latitudeDelta: 0.08,
  longitudeDelta: 0.08,
};

export default function GpsMap({ location, fallbackRegion = DEFAULT_FALLBACK_REGION }) {
  const mapRef = useRef(null);
  const previousLocationRef = useRef(null);

  console.log("[GpsMap] location:", location);

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

      console.log("[GpsMap] animate region:", nextRegion);
      mapRef.current?.animateToRegion(nextRegion, 500);
      previousLocationRef.current = {
        latitude,
        longitude,
      };
    }
  }, [location]);

  const hasLocation =
    Number.isFinite(Number(location?.latitude)) &&
    Number.isFinite(Number(location?.longitude));

  const markerCoordinate = hasLocation
    ? {
        latitude: Number(location.latitude),
        longitude: Number(location.longitude),
      }
    : null;

  if (markerCoordinate) {
    console.log("[GpsMap] marker coordinate:", markerCoordinate);
  }

  return (
    <MapView
      ref={mapRef}
      style={styles.map}
      initialRegion={fallbackRegion}
      showsCompass
      showsMyLocationButton={false}
      showsScale={false}
    >
      {markerCoordinate && (
        <Marker
          coordinate={{
            latitude: Number(location.latitude),
            longitude: Number(location.longitude),
          }}
          title="VT03F"
          description="Ubicación actual"
          rotation={Number(location.course) || 0}
        />
      )}
    </MapView>
  );
}

const styles = StyleSheet.create({
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});
