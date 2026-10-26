import React, { useRef, useState, useEffect } from "react";
import { View, Text, Pressable } from "react-native";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
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
import { getLinkedStudents } from "@core/services/familyService";
import { startTripApi } from "@core/services/tripApi";
import { apiPost } from "@core/services/apiClient";
import { useSession } from "@core/hooks/useSession";
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

/** Normaliza paradas igual que en MainPage. */
function normalizeStops(route) {
  const stops = Array.isArray(route?.stops) ? route.stops : [];
  return stops
    .map((stop, index) => {
      const latitude = Number(stop?.latitude);
      const longitude = Number(stop?.longitude);
      return {
        id: stop?.id ?? index,
        name: stop?.name ?? "",
        address: stop?.address ?? "",
        orderSequence: stop?.orderSequence ?? index,
        latitude,
        longitude,
      };
    })
    .filter(
      (stop) =>
        Number.isFinite(stop.latitude) &&
        Number.isFinite(stop.longitude) &&
        !(stop.latitude === 0 && stop.longitude === 0),
    )
    .sort((a, b) => a.orderSequence - b.orderSequence);
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
  const { role } = useSession();
  const mapRef = useRef(null);
  const { location, error, loading, lastUpdated, fallbackLocation } = useGpsTracking();

  // Estado para ruta del conductor/padre + sugerencia OSRM
  const [routeStops, setRouteStops] = useState([]);
  const [routeGeometry, setRouteGeometry] = useState([]);

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

  // Cargar ruta del conductor o padre + sugerencia OSRM
  useEffect(() => {
    let mounted = true;
    async function loadRoute() {
      try {
        const session = await getSession();
        if (!session?.profileId) return;

        let route = null;

        if (role === "driver") {
          // Conductor: obtener ruta del día
          const today = await fetchRoute(`/routes/today?driverId=${session.profileId}`);
          if (!today?.route) return;
          route = today.route;
        } else if (role === "parent") {
          // Padre: obtener ruta del estudiante vinculado
          const [student] = await getLinkedStudents(session);
          if (!student?.profileId) return;
          const routeData = await fetchRoute(`/routes/student/${student.profileId}`);
          if (!routeData) return;
          route = routeData;
        } else {
          return; // Otros roles no cargan ruta en LiveTracking
        }

        // 1) Geometría vial OSRM (sugerencia de ruta)
        try {
          const suggestion = await getRouteSuggestionApi(route.id);
          // Backend devuelve RouteSuggestionGeometryDto con Points (PascalCase)
          // GeoPointDto tiene Latitude/Longitude -> transformar a lowercase para Polyline
          if (suggestion?.geometry?.Points && mounted) {
            setRouteGeometry(
              suggestion.geometry.Points.map((p) => ({
                latitude: p.Latitude,
                longitude: p.Longitude,
              }))
            );
          }
        } catch (err) {
          console.error("[LiveTracking] Error loading route geometry:", err);
        }

        // 2) Paradas normalizadas
        const stops = normalizeStops(route);
        if (mounted) {
          setRouteStops(stops);
        }

        // 3) Info de horario y dirección para TripActionButton
        if (mounted) {
          const direction = route.Schedules?.[0]?.Direction ?? null;
          setTripDirection(direction);
          setTripSchedule({
            startTime: route.startTime,
            endTime: route.endTime,
          });
        }
      } catch (err) {
        console.error("[LiveTracking] Error loading route:", err);
      }
    }

    loadRoute();
    return () => { mounted = false; };
  }, [role]);

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


      {/* Botón contextual Iniciar/Terminar - posicionado arriba del BottomTabBar */}
      <View style={styles.tripButtonContainer} pointerEvents="box-none">
        <TripActionButton
          status={tripStatus}
          direction={tripDirection}
          schedule={tripSchedule}
          onStart={handleStartTrip}
          onEnd={handleEndTrip}
          showWhenEnded={false}
        />
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