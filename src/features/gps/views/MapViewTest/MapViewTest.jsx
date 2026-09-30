import React from "react";
import MapView from "react-native-maps";

export default function MapViewTest() {
  return (
    <MapView
      style={{ flex: 1 }}
      initialRegion={{
        latitude: 2.964873888888889,
        longitude: -75.28462666666667,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }}
      onMapReady={() => console.log("[MapTest] MAP READY")}
      onError={(error) => console.log("[MapTest] MAP ERROR", error)}
    />
  );
}