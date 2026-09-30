import React from "react";
import { View, Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import { useTheme } from "@core/services/ThemeService";
import { useNavigation } from "@react-navigation/native";
import TopBar from "@components/TopBar";
import BottomTabBar from "@components/layout/BottomTabBar";
import GpsMap from "@features/gps/components/GpsMap";
import useGpsTracking from "@features/gps/hooks/useGpsTracking";
import styles from "./LiveTracking.style";

function formatDateInBogota(dateValue) {
  if (!dateValue) {
    return "--";
  }

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return "--";
  }

  return new Intl.DateTimeFormat("es-CO", {
    timeZone: "America/Bogota",
    dateStyle: "short",
    timeStyle: "short",
  }).format(date);
}

export default function LiveTracking() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const navigation = useNavigation();
  const { location, error, loading, lastUpdated, fallbackLocation } = useGpsTracking();

  console.log("[LiveTracking] location:", location);
  console.log("[LiveTracking] loading:", loading);
  console.log("[LiveTracking] error:", error);

  const statusText = location?.status || "GPS sin conexión";
  const vehicleSpeed = location?.speed != null ? `${Number(location.speed).toFixed(0)} km/h` : "0 km/h";
  const coordinatesText = location
    ? `${location.latitude.toFixed(6)}, ${location.longitude.toFixed(6)}`
    : "--";

  return (
    <View style={[styles.container, { backgroundColor: theme.bgColor }]}>
      <View style={[styles.header, { paddingTop: Math.max(insets.top, 12) }]}>
        <Text style={[styles.title, { color: theme.titleColor }]}>
          {t("gps.vehicleLocation") || "Ubicación del vehículo"}
        </Text>
        <TopBar
          config={{ showSearchInput: false, showNotifications: true }}
          onNotificationPress={() => navigation.navigate("Notifications")}
        />
      </View>

      <View style={styles.mapContainer}>
        <GpsMap
          location={location || null}
          fallbackRegion={{
            latitude: fallbackLocation.latitude,
            longitude: fallbackLocation.longitude,
            latitudeDelta: 0.08,
            longitudeDelta: 0.08,
          }}
        />

        {!location && (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>
              {loading
                ? "Esperando ubicación..."
                : error || "Esperando ubicación..."}
            </Text>
          </View>
        )}

      </View>

      <View style={styles.infoCard}>
        <View style={[styles.card, { backgroundColor: theme.cardBg, borderColor: theme.borderColor }]}>
          <View style={styles.row}>
            <Text style={styles.label}>{t("gps.status") || "Estado"}</Text>
            <Text style={[styles.value, { color: theme.textColor }]}>
              {statusText}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>{t("gps.speed") || "Velocidad"}</Text>
            <Text style={[styles.value, { color: theme.textColor }]}>
              {vehicleSpeed}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>{t("gps.lastUpdated") || "Última actualización"}</Text>
            <Text style={[styles.value, { color: theme.textColor }]}>
              {formatDateInBogota(lastUpdated || location?.receivedAt || location?.gpsDateTime || location?.dateTime)}
            </Text>
          </View>

          <View style={[styles.row, styles.lastRow]}>
            <Text style={styles.label}>Coordenadas</Text>
            <Text style={[styles.value, { color: theme.textColor }]}>
              {coordinatesText}
            </Text>
          </View>

          {error ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>
                {location ? (t("gps.lastKnownLocation") || "Última ubicación disponible") : (t("gps.noLocationAvailable") || "Sin ubicación disponible")}
              </Text>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}
        </View>
      </View>

      <BottomTabBar
        onRoutePress={() => navigation.navigate("MainPage")}
        onLocationPress={() => navigation.navigate("LiveTracking")}
        onProfilePress={() => navigation.navigate("Profile")}
      />
    </View>
  );
}
