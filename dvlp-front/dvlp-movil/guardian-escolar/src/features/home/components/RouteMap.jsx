import React, { useEffect, useRef } from "react";
import { StyleSheet, View } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import MapView, { Marker } from "react-native-maps";
import { toValidCoordinate } from "@features/gps/routeMapData";

const DEFAULT_REGION = {
  latitude: 2.9273,
  longitude: -75.2819,
  latitudeDelta: 0.08,
  longitudeDelta: 0.08,
};

export default function RouteMap({ stops, vehicleLocation }) {
  const { t } = useTranslation();
  const mapRef = useRef(null);
  const mapReadyRef = useRef(false);
  const stopsRef = useRef([]);
  const vehicleCoordinate = toValidCoordinate(vehicleLocation);

  const fitStopsOnMap = () => {
    const routeStops = stopsRef.current;
    if (!mapReadyRef.current || routeStops.length === 0) return;

    if (routeStops.length === 1) {
      mapRef.current?.animateToRegion(
        { ...routeStops[0], latitudeDelta: 0.01, longitudeDelta: 0.01 },
        300
      );
      return;
    }

    mapRef.current?.fitToCoordinates(
      routeStops.map(({ latitude, longitude }) => ({ latitude, longitude })),
      {
        edgePadding: { top: 90, right: 40, bottom: 280, left: 40 },
        animated: true,
      }
    );
  };

  useEffect(() => {
    stopsRef.current = stops;
    fitStopsOnMap();
  }, [stops]);

  return (
    <MapView
      ref={mapRef}
      style={StyleSheet.absoluteFill}
      initialRegion={DEFAULT_REGION}
      onMapReady={() => {
        mapReadyRef.current = true;
        fitStopsOnMap();
      }}
      onError={(event) => console.error("[RouteMap] map error:", event.nativeEvent || event)}
    >
      {/* No se dibuja una línea: sin geometría vial del backend sería un segmento recto engañoso. */}

      {stops.map((stop) => (
        <Marker
          key={`${stop.id}-${stop.originalIndex}`}
          coordinate={{ latitude: stop.latitude, longitude: stop.longitude }}
          title={`${stop.orderSequence}. ${stop.name || t("cards.stops")}`}
          description={stop.address || undefined}
          tracksViewChanges={false}
        />
      ))}

      {vehicleCoordinate && (
        <Marker
          coordinate={vehicleCoordinate}
          title="VT03F"
          description="Ubicación actual"
          rotation={Number(vehicleLocation?.course) || 0}
          anchor={{ x: 0.5, y: 0.5 }}
        >
          <View style={styles.busMarker}>
            <FontAwesome5 name="bus" size={19} color="#FFFFFF" />
          </View>
        </Marker>
      )}
    </MapView>
  );
}

const styles = StyleSheet.create({
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
