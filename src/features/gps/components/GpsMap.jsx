import React, { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import { StyleSheet, View } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { FontAwesome5 } from "@expo/vector-icons";

const DEFAULT_FALLBACK_REGION = {
  latitude: 2.9273,
  longitude: -75.2819,
  latitudeDelta: 0.08,
  longitudeDelta: 0.08,
};

const GpsMap = forwardRef(function GpsMap({ location, fallbackRegion = DEFAULT_FALLBACK_REGION }, ref) {
  const mapRef = useRef(null);
  const previousLocationRef = useRef(null);
  const mapReadyRef = useRef(false);
  const pendingRegionRef = useRef(null);

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
      }}
      onError={(event) => console.error("[GpsMap] map error:", event.nativeEvent || event)}
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
});
