import React, { useRef } from "react";
import { View, Text, Pressable } from "react-native";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import { useTheme } from "@core/services/ThemeService";
import { useNavigation } from "@react-navigation/native";
import NotificationButton from "@components/buttons/NotificationButton";
import BottomTabBar from "@components/layout/BottomTabBar";
import GpsMap from "@features/gps/components/GpsMap";
import useGpsTracking from "@features/gps/hooks/useGpsTracking";
import styles from "./LiveTracking.style";

function formatDateInBogota(dateValue) {
  if (!dateValue) return "--";
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return "--";
  return new Intl.DateTimeFormat("es-CO", {
    timeZone: "America/Bogota",
    timeStyle: "short",
  }).format(date);
}

export default function LiveTracking() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const navigation = useNavigation();
  const mapRef = useRef(null);
  const { location, error, loading, lastUpdated, fallbackLocation } = useGpsTracking();

  const statusText = location?.status;
  const speedValue = location?.speed;
  const speed = speedValue != null && speedValue !== "" && Number.isFinite(Number(speedValue))
    ? `${Number(speedValue).toFixed(0)} km/h`
    : null;
  const updatedAt = formatDateInBogota(
    lastUpdated || location?.receivedAt || location?.gpsDateTime || location?.dateTime,
  );
  return (
    <View style={styles.container}>
      <GpsMap
        ref={mapRef}
        location={location || null}
        fallbackRegion={{
          latitude: fallbackLocation.latitude,
          longitude: fallbackLocation.longitude,
          latitudeDelta: 0.08,
          longitudeDelta: 0.08,
        }}
      />

      <View style={[styles.topControls, { top: Math.max(insets.top, 12) }]}>
        <View style={styles.titlePill}>
          <Text numberOfLines={1} style={[styles.title, { color: theme.titleColor }]}>
            {t("gps.vehicleLocation")}
          </Text>
        </View>
        <View style={styles.notificationButton}>
          <NotificationButton onPress={() => navigation.navigate("Notifications")} />
        </View>
      </View>

      {!location && (loading || error) && (
        <View style={[styles.loadingContainer, { top: Math.max(insets.top, 12) + 60 }]}>
          <Text style={styles.loadingText}>
            {loading ? t("gps.loadingLocation") : error || t("gps.loadingLocation")}
          </Text>
        </View>
      )}

      {((statusText != null && statusText !== "") || speed != null || updatedAt !== "--") && (
        <View style={styles.locationInfoContainer}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={t("gps.centerOnLocation")}
            onPress={() => mapRef.current?.centerOnLocation()}
            style={({ pressed }) => [
              styles.centerButton,
              { backgroundColor: theme.navbarColor },
              pressed && { opacity: 0.8 },
            ]}
          >
            <Ionicons name="locate" size={23} color="#FFFFFF" />
          </Pressable>
          <View
            style={[
              styles.gpsCard,
              { backgroundColor: theme.cardBg, borderColor: theme.borderColor },
            ]}
          >
            <View style={styles.cardHeader}>
              
              <Text style={[styles.cardTitle, { color: theme.titleColor }]}>
                {t("gps.vehicleLocation")}
              </Text>
            </View>
            {statusText != null && statusText !== "" && (
              <View style={styles.gpsRow}>
                <Text style={[styles.gpsLabel, { color: theme.titleColor }]}>{t("gps.status")}</Text>
                <Text style={[styles.gpsValue, { color: theme.textSecondary }]}>{String(statusText)}</Text>
              </View>
            )}
            {speed != null && (
              <View style={styles.gpsRow}>
                <Text style={[styles.gpsLabel, { color: theme.titleColor }]}>{t("gps.speed")}</Text>
                <Text style={[styles.gpsValue, { color: theme.textSecondary }]}>{speed}</Text>
              </View>
            )}
            {updatedAt !== "--" && (
              <View style={styles.gpsRow}>
                <Text style={[styles.gpsLabel, { color: theme.titleColor }]}>{t("gps.lastUpdated")}</Text>
                <Text style={[styles.gpsValue, { color: theme.textSecondary }]}>{updatedAt}</Text>
              </View>
            )}
          </View>
        </View>
      )}

      <View style={styles.bottomBarOverlay} pointerEvents="box-none">
        <BottomTabBar
          onRoutePress={() => navigation.navigate("MainPage")}
          onLocationPress={() => navigation.navigate("LiveTracking")}
          onProfilePress={() => navigation.navigate("Profile")}
        />
      </View>
    </View>
  );
}
