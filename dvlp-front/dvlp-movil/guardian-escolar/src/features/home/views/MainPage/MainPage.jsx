import React, { useState, useEffect, useRef } from "react";
import { View, Text, Pressable } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import RouteInfoCard from "@components/cards/RouteInfoCard";
import BottomTabBar from "@components/layout/BottomTabBar";
import useWindow from "@core/hooks/useWindow";
import TopBar from "@components/TopBar";
import { roleConfig } from "@core/config/roles/roleConfig";
import { useNavigation } from "@react-navigation/native";
import useSession from "@core/hooks/useSession";
import QRButtom from "@components/buttons/QRButtom";
import QRDisplayModal from "@components/modals/QRDisplayModal";
import QRScannerModal from "@components/modals/QRScannerModal";
import { getSession } from "@core/services/authService";
import { getRouteApi } from "@core/services/routeApi";
import { getLinkedStudents } from "@core/services/familyService";
import { scanCredential } from "@core/services/notificationApi";

import styles from "./MainPage.style";

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

/** "06:30:00" -> "06:30". */
function shortTime(value) {
  const text = String(value ?? "");
  return text.length >= 5 ? text.slice(0, 5) : text;
}

/**
 * Salidas programadas de la ruta (FR-9.1/FR-9.2), resumidas para la tarjeta.
 * Usa los horarios reales (`schedules[]`) y cae al rango de la ruta si aún no hay.
 */
function formatSchedules(route) {
  const schedules = Array.isArray(route?.schedules) ? route.schedules : [];
  const times = [
    ...new Set(schedules.map((schedule) => shortTime(schedule?.startTime)).filter(Boolean)),
  ].sort();

  if (times.length > 0) {
    return times.join(" · ");
  }

  const start = shortTime(route?.startTime);
  const end = shortTime(route?.endTime);
  return start && end ? `${start} - ${end}` : "";
}

/** GET a ms-route que devuelve null en vez de propagar el error. */
async function fetchRoute(path) {
  try {
    return await getRouteApi(path);
  } catch {
    return null;
  }
}

/**
 * Ruta visible para el rol autenticado:
 * - student: su propia ruta asignada.
 * - driver:  su ruta del día, solo dentro de la ventana activa.
 * - father:  la ruta del estudiante vinculado (FR-9.1).
 * - otros:   primera ruta, como respaldo.
 */
async function resolveRouteForRole(role, session) {
  if (role === "student") {
    return fetchRoute(`/routes/student/${session.profileId}`);
  }

  if (role === "driver") {
    const today = await fetchRoute(`/routes/today?driverId=${session.profileId}`);
    return today?.status === "ACTIVE" ? (today.route ?? null) : null;
  }

  if (role === "father") {
    const [student] = await getLinkedStudents(session);
    return student ? fetchRoute(`/routes/student/${student.profileId}`) : null;
  }

  const routes = await fetchRoute("/routes");
  return Array.isArray(routes) ? (routes[0] ?? null) : null;
}

export default function MainPage() {
  const { width } = useWindow();
  const insets = useSafeAreaInsets();
  const horizontalPadding = width < 360 ? 12 : 16;
  const navigation = useNavigation();
  const { role } = useSession();
  const { t } = useTranslation();
  const config = roleConfig[role];

  const [modalType, setModalType] = useState(null);
  const [routeInfo, setRouteInfo] = useState(null);
  const [routeStops, setRouteStops] = useState([]);
  const [, setLoading] = useState(true);
  const [scanMode, setScanMode] = useState("ON_BOARD");

  const mapRef = useRef(null);
  const mapReadyRef = useRef(false);
  const stopsRef = useRef([]);

  // Encuadra el mapa sobre las paradas de la ruta (si las hay).
  const fitStopsOnMap = () => {
    const stops = stopsRef.current;
    if (!mapReadyRef.current || stops.length === 0) return;

    mapRef.current?.fitToCoordinates(
      stops.map((stop) => ({
        latitude: stop.latitude,
        longitude: stop.longitude,
      })),
      {
        edgePadding: { top: 90, right: 40, bottom: 280, left: 40 },
        animated: true,
      },
    );
  };

  const handleOpenModal = (type) => setModalType(type);
  const handleCloseModal = () => setModalType(null);

  const handleQrScan = async (qrToken) => {
    try {
      await scanCredential(qrToken, scanMode);
    } catch (error) {
      console.error("Error processing QR scan:", error);
    }
  };

  useEffect(() => {
    async function loadRouteInfo() {
      try {
        const session = await getSession();
        if (!session) {
          setLoading(false);
          return;
        }

        // Ruta según el rol. El bus, el conductor y los horarios vienen en el
        // mismo detalle de ms-route (FR-9.1/FR-9.2), así que ya no hay que
        // cruzar ms-fleet a mano como antes.
        const route = await resolveRouteForRole(role, session);

        if (!route) {
          stopsRef.current = [];
          setRouteStops([]);
          setLoading(false);
          return;
        }

        // RouteDetailDto (conductor/estudiante) incluye stops[];
        // RouteListDto solo trae stopsCount.
        const stops = normalizeStops(route);
        stopsRef.current = stops;
        setRouteStops(stops);

        setRouteInfo({
          routeName: route.name,
          driverName: route.bus?.driverName ?? "",
          plate: route.bus?.plate ?? "",
          schedule: formatSchedules(route),
          stopsCount:
            route.stopsCount != null && route.stopsCount !== ""
              ? String(route.stopsCount)
              : stops.length > 0
                ? String(stops.length)
                : "—",
          finalDestination: route.targetSector ?? "",
        });
      } catch (error) {
        console.error("Error loading route info:", error);
      } finally {
        setLoading(false);
      }
    }

    loadRouteInfo();
  }, [role]);

  useEffect(() => {
    fitStopsOnMap();
  }, [routeStops]);

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={{
          latitude: 2.9273,
          longitude: -75.2819,
          latitudeDelta: 0.08,
          longitudeDelta: 0.08,
        }}
        onMapReady={() => {
          mapReadyRef.current = true;
          fitStopsOnMap();
        }}
      >
        {routeStops.map((stop, index) => (
          <Marker
            key={stop.id}
            coordinate={{
              latitude: stop.latitude,
              longitude: stop.longitude,
            }}
            title={stop.name || `${t("cards.stops")} ${index + 1}`}
            description={stop.address || undefined}
            tracksViewChanges={false}
          />
        ))}
      </MapView>

      <View
        style={[
          styles.topBarContainer,
          {
            paddingTop: Math.max(insets.top, 12),
            paddingHorizontal: horizontalPadding,
          },
        ]}
        pointerEvents="box-none"
      >
        <TopBar
          config={config.topBar}
          onNotificationPress={() => navigation.navigate("Notifications")}
        />
      </View>

      <View
        style={[
          styles.overlay,
          {
            paddingHorizontal: horizontalPadding,
            paddingBottom: 0,
          },
        ]}
        pointerEvents="box-none"
      >
        <View style={styles.spacer} />

        <View
          style={[
            styles.bottomSection,
            { marginHorizontal: -horizontalPadding },
          ]}
        >
          <RouteInfoCard
            routeName={routeInfo?.routeName ?? ""}
            driverName={routeInfo?.driverName ?? ""}
            plate={routeInfo?.plate ?? ""}
            schedule={routeInfo?.schedule ?? ""}
            stopsCount={routeInfo?.stopsCount ?? ""}
            finalDestination={routeInfo?.finalDestination ?? ""}
          />
          <BottomTabBar
            onRoutePress={() => navigation.navigate("MainPage")}
            onLocationPress={() => navigation.navigate("LiveTracking")}
            onProfilePress={() => navigation.navigate("Profile")}
          />
        </View>

        <View style={styles.qrButtonContainer} pointerEvents="box-none">
          <QRButtom config={config.card} onOpenModel={handleOpenModal} />
        </View>
      </View>

      <QRDisplayModal
        visible={modalType === "activeQR"}
        onClose={handleCloseModal}
      />

      {modalType === "qrScanner" && (
        <View style={styles.scanModeContainer}>
          <Pressable
            style={[
              styles.scanModeButton,
              scanMode === "ON_BOARD" && styles.scanModeActive,
            ]}
            onPress={() => setScanMode("ON_BOARD")}
          >
            <Text style={styles.scanModeText}>ABORDAR</Text>
          </Pressable>
          <Pressable
            style={[
              styles.scanModeButton,
              scanMode === "OFF_BOARD" && styles.scanModeActive,
            ]}
            onPress={() => setScanMode("OFF_BOARD")}
          >
            <Text style={styles.scanModeText}>DESCENDER</Text>
          </Pressable>
        </View>
      )}

      <QRScannerModal
        visible={modalType === "qrScanner"}
        onClose={handleCloseModal}
        onScan={handleQrScan}
      />
    </View>
  );
}
