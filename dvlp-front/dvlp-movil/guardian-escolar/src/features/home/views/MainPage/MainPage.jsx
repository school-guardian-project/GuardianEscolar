import React, { useState, useEffect, useRef } from "react";
import { View, Text, Pressable } from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import RouteInfoCard from "@components/cards/RouteInfoCard";
import BottomTabBar from "@components/layout/BottomTabBar";
import useWindow from "@core/hooks/useWindow";
import TopBar from "@components/TopBar";
import { roleConfig } from "@core/config/roles/roleConfig";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import useSession from "@core/hooks/useSession";
import useGpsTracking from "@features/gps/hooks/useGpsTracking";
import QRButtom from "@components/buttons/QRButtom";
import IncidentReportButton from "@components/buttons/IncidentReportButton";
import QRDisplayModal from "@components/modals/QRDisplayModal";
import QRScannerModal from "@components/modals/QRScannerModal";
import IncidentReportModal from "@components/modals/IncidentReportModal";
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
  const isFocused = useIsFocused();
  const config = roleConfig[role];
  const [modalType, setModalType] = useState(null);
  const [incidentOpen, setIncidentOpen] = useState(false);
  const [routeInfo, setRouteInfo] = useState(null);
  const [routeStops, setRouteStops] = useState([]);
  const [, setLoading] = useState(true);
  const [scanMode, setScanMode] = useState("ON_BOARD");
  const [status, setStatus] = useState(null);
  const mapRef = useRef(null);
  const mapReadyRef = useRef(false);
  const stopsRef = useRef([]);

  // GPS Tracking (solo si está enfocada la pantalla)
  const { location, routeCoordinates } = useGpsTracking(undefined, isFocused);

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
      // Contrato de ms-notification (FR-4.1): { qrToken, boardingType }.
      // scanMode ya usa los valores del enum ON_BOARD/OFF_BOARD.
      await scanCredential(qrToken, scanMode);
      handleCloseModal();
    } catch (error) {
      console.error("Error processing QR scan:", error);
    }
  };

  useEffect(() => {
    async function loadRouteInfo() {
      try {
        const session = await getSession();
        if (!session?.profileId) {
          setStatus("No se pudo verificar la ruta asignada.");
          return;
        }

        // Resuelve la ruta visible por rol con los endpoints reales de
        // ms-route: el padre usa la ruta del estudiante vinculado (FR-9.1)
        // en lugar de caer al listado general, que exige permisos de admin.
        const route = await resolveRouteForRole(role, session);

        if (!route) {
          stopsRef.current = [];
          setRouteStops([]);
          setRouteInfo(null);
          if (role === "driver") setStatus("No hay una ruta asignada.");
          return;
        }

        // RouteDetailDto ya incluye el bus asignado con su conductor
        // (ms-route lo resuelve vía gRPC a ms-fleet), así que el móvil
        // no necesita consultar la flota directamente.
        const stops = normalizeStops(route);
        stopsRef.current = stops;
        setRouteStops(stops);

        const schedule =
          route.startTime && route.endTime
            ? `${route.startTime} - ${route.endTime}`
            : "";
        const stopsCount =
          route.stopsCount != null && route.stopsCount !== ""
            ? String(route.stopsCount)
            : stops.length > 0
              ? String(stops.length)
              : "—";

        setRouteInfo({
          routeName: route.name ?? "",
          driverName: route.bus?.driverName ?? "",
          plate: route.bus?.plate ?? "",
          schedule,
          stopsCount,
          finalDestination: route.targetSector ?? "",
        });
      } catch (error) {
        console.error("Error loading route info:", error);
        setStatus("No fue posible verificar la ruta asignada.");
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
        {/* Trazo de la ruta (paradas) */}
        {routeStops.length >= 2 && (
          <Polyline
            coordinates={routeStops.map(({ latitude, longitude }) => ({
              latitude,
              longitude,
            }))}
            strokeColor="#1A56DB"
            strokeWidth={4}
          />
        )}

        {/* Marcadores de paradas */}
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

      {/* Encabezado */}
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

      {/* Mensaje de estado */}
      {status ? (
        <View style={[styles.statusMessage, { left: horizontalPadding, right: horizontalPadding }]}>
          <Text style={styles.statusMessageText}>{status}</Text>
        </View>
      ) : null}

      {/* Overlay: tarjeta de ruta + navegación */}
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

        <View style={[styles.bottomSection, { marginHorizontal: -horizontalPadding }]}>
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

        {config.card.showIncidentReport && (
          <View style={styles.incidentButtonContainer} pointerEvents="box-none">
            <IncidentReportButton onPress={() => setIncidentOpen(true)} />
          </View>
        )}
      </View>

      <IncidentReportModal
        visible={incidentOpen}
        onClose={() => setIncidentOpen(false)}
      />

      {/* Modales */}
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
