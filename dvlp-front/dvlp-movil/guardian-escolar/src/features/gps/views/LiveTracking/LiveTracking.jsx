import React, { useRef, useState, useEffect } from "react";
import { View, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import { useTheme } from "@core/services/ThemeService";
import { useNavigation } from "@react-navigation/native";
import NotificationButton from "@components/buttons/NotificationButton";
import BottomTabBar from "@components/layout/BottomTabBar";
import TripActionButton from "@components/buttons/TripActionButton";
import GpsMap from "@features/gps/components/GpsMap";
import useGpsTracking from "@features/gps/hooks/useGpsTracking";
import { getSession } from "@core/services/authService";
import { getRouteApi, getRouteSuggestionApi } from "@core/services/routeApi";
import { resolveRouteForRole } from "@core/services/visibleRouteService";
import { normalizeStops, normalizeGeometry } from "@features/gps/routeMapData";
import { startTripApi } from "@core/services/tripApi";
import { apiPost } from "@core/services/apiClient";
import useSession from "@core/hooks/useSession";
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

/** GET a ms-route que devuelve null en vez de propagar el error. */
async function fetchRoute(path) {
  try {
    return await getRouteApi(path);
  } catch (error) {
    console.error(`[LiveTracking/fetchRoute] Error fetching ${path}:`, {
      status: error?.status,
      message: error?.message,
      data: error?.data,
    });
    return null;
  }
}

export default function LiveTracking() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const navigation = useNavigation();
  const { role, initialized } = useSession();
  const mapRef = useRef(null);
  const { location, error, loading, lastUpdated, fallbackLocation } = useGpsTracking();

  const [routeStops, setRouteStops] = useState([]);
  const [routeGeometry, setRouteGeometry] = useState([]);
  const [routeStatus, setRouteStatus] = useState(null);

  // Estado unificado del viaje (igual que MainPage)
  const [tripStatus, setTripStatus] = useState("idle"); // 'idle' | 'active' | 'ended'
  const [currentTripId, setCurrentTripId] = useState(null);
  const [tripDirection, setTripDirection] = useState(null); // 'Ida' | 'Vuelta'
  const [tripSchedule, setTripSchedule] = useState({ startTime: null, endTime: null });

  const statusText = location?.status;
  const speedValue = location?.speed;
  const speed = speedValue != null && speedValue !== "" && Number.isFinite(Number(speedValue))
    ? `${Number(speedValue).toFixed(0)} km/h`
    : null;
  const updatedAt = formatDateInBogota(
    lastUpdated || location?.receivedAt || location?.gpsDateTime || location?.dateTime,
  );

  useEffect(() => {
    let mounted = true;
    setRouteStops([]);
    setRouteGeometry([]);
    setRouteStatus(null);
    setTripDirection(null);
    setTripSchedule({ startTime: null, endTime: null });
    if (!initialized) return;
    async function loadRoute() {
      try {
        const session = await getSession();
        const { route, note } = await resolveRouteForRole(role, session);
        if (!mounted) return;
        setRouteStatus(note);
        if (!route) return;
        setRouteStops(normalizeStops(route));
        setTripDirection(route.schedules?.[0]?.direction ?? null);
        setTripSchedule({ startTime: route.startTime, endTime: route.endTime });

        // Stops are available even if the optional road geometry is slow or unavailable.
        try {
          const suggestion = await getRouteSuggestionApi(route.id);
          if (mounted) setRouteGeometry(normalizeGeometry(suggestion));
        } catch (err) {
          console.error("[LiveTracking] Error loading route geometry:", err);
          if (mounted) setRouteStatus("No fue posible cargar el trazado vial. Se muestran las paradas.");
        }
      } catch (err) {
        console.error("[LiveTracking] Error loading route:", err);
        if (mounted) setRouteStatus("No fue posible verificar la ruta asignada.");
      }
    }

    loadRoute();
    return () => { mounted = false; };
  }, [role, initialized]);

  // Esperar a que la sesión esté inicializada (rol cargado desde SecureStore).
  // Va DESPUÉS de todos los hooks: así la cantidad de hooks no cambia entre
  // renders (rules of hooks) mientras se muestra el loading.
  if (!initialized) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ color: theme.navbarColor, marginTop: 12 }}>Cargando sesión...</Text>
      </View>
    );
  }

  const handleStartTrip = async () => {
    try {
      const session = await getSession();
      if (!session?.profileId) return;

      // Obtener routeId y busId de la ruta de hoy
      const today = await fetchRoute(`/routes/today?driverId=${session.profileId}`);
      if (!today?.route) return;

      const route = today.route;
      const payload = {
        routeId: route.id,
        busId: route.bus?.id,
        driverId: session.profileId,
      };

      const result = await startTripApi(payload);
      if (result?.id) {
        setCurrentTripId(result.id);
      } else if (result?.tripId) {
        setCurrentTripId(result.tripId);
      }
      setTripStatus("active");
    } catch (error) {
      console.error("[LiveTracking] Error starting trip:", error);
    }
  };

  const handleEndTrip = async () => {
    try {
      if (!currentTripId) return;
      await apiPost(`/route/api/trips/end?tripId=${currentTripId}`, {});
      setTripStatus("ended");
      setCurrentTripId(null);
    } catch (error) {
      console.error("[LiveTracking] Error ending trip:", error);
    }
  };

  return (
    <View style={styles.container}>
      <GpsMap
        ref={mapRef}
        location={location || null}
        routeStops={routeStops}
        routeGeometry={routeGeometry}
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

      {(routeStatus || (!location && (loading || error))) && (
        <View style={[styles.loadingContainer, { top: Math.max(insets.top, 12) + 60 }]}>
          <Text style={styles.loadingText}>
            {routeStatus || (loading ? t("gps.loadingLocation") : error || t("gps.loadingLocation"))}
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

      {/* Botón contextual Iniciar/Terminar - posicionado arriba del BottomTabBar */}
      <View style={styles.tripButtonContainer} pointerEvents="box-none">
        {role === "driver" && routeStops.length > 0 && (
          <TripActionButton
            status={tripStatus}
            direction={tripDirection}
            schedule={tripSchedule}
            onStart={handleStartTrip}
            onEnd={handleEndTrip}
            showWhenEnded={false}
          />
        )}
      </View>
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