import React, { useState, useEffect, useRef } from "react";
import { View, Text, Pressable } from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import { FontAwesome5 } from "@expo/vector-icons";
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
 * Ruta visible para el rol autenticado, con el aviso que corresponde cuando
 * no hay una que mostrar:
 * - student: su propia ruta asignada.
 * - driver:  su ruta del día, solo dentro de la ventana activa.
 * - father:  la ruta del estudiante vinculado (FR-9.1).
 * - otros:   primera ruta, como respaldo.
 */
async function resolveRouteForRole(role, session) {
  if (role === "student") {
    const route = await fetchRoute(`/routes/student/${session.profileId}`);
    return { route, note: route ? null : "Aún no tienes una ruta asignada." };
  }

  if (role === "driver") {
    const today = await fetchRoute(`/routes/today?driverId=${session.profileId}`);
    if (today?.status === "ACTIVE") {
      return { route: today.route ?? null, note: null };
    }
    // SCHEDULED trae la próxima salida: decir "sin ruta" confundía al conductor.
    if (today?.status === "SCHEDULED" && today.nextOccurrence) {
      const next = new Date(today.nextOccurrence).toLocaleString("es-CO", {
        weekday: "long",
        hour: "2-digit",
        minute: "2-digit",
      });
      return { route: null, note: `Tu próximo recorrido es el ${next}.` };
    }
    return { route: null, note: "No hay una ruta asignada." };
  }

  if (role === "father") {
    const [student] = await getLinkedStudents(session);
    if (!student) {
      return { route: null, note: "No hay estudiantes vinculados a tu cuenta." };
    }
    const route = await fetchRoute(`/routes/student/${student.profileId}`);
    return { route, note: route ? null : "El estudiante aún no tiene una ruta asignada." };
  }

  const routes = await fetchRoute("/routes");
  return { route: Array.isArray(routes) ? (routes[0] ?? null) : null, note: null };
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
  const [scanFeedback, setScanFeedback] = useState(null);
  const mapRef = useRef(null);
  const mapReadyRef = useRef(false);
  const stopsRef = useRef([]);

  // GPS Tracking (solo si está enfocada la pantalla)
  const { location } = useGpsTracking(undefined, isFocused);
  const busLatitude = Number(location?.latitude);
  const busLongitude = Number(location?.longitude);
  const busCoordinate =
    location && Number.isFinite(busLatitude) && Number.isFinite(busLongitude)
      ? { latitude: busLatitude, longitude: busLongitude }
      : null;

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
      const result = await scanCredential(qrToken, scanMode);
      handleCloseModal();

      // El driver necesita saber que el sistema ya hizo lo suyo: sin esto el
      // escaneo cerraba el modal y no confirmaba nada. `alreadyProcessed`
      // distingue un registro nuevo de un movimiento que ya se había notificado.
      setScanFeedback({
        type: "success",
        message: result?.alreadyProcessed
          ? t("cards.scanAlready")
          : scanMode === "OFF_BOARD"
            ? t("cards.scanAlighted")
            : t("cards.scanBoarded"),
      });
    } catch (error) {
      handleCloseModal();

      // El backend explica el motivo real (fuera de horario, QR de otra ruta,
      // sin abordaje activo) en `message`; se muestra en vez de solo loguearlo.
      setScanFeedback({
        type: "error",
        message:
          error?.data?.message ??
          t("serviceErrors.requestFailed"),
      });
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
        const { route, note } = await resolveRouteForRole(role, session);
        setStatus(note);

        if (!route) {
          stopsRef.current = [];
          setRouteStops([]);
          setRouteInfo(null);
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

  // El aviso del escaneo se retira solo: el driver no debe cerrarlo a mano
  // para volver a la operación.
  useEffect(() => {
    if (!scanFeedback) return undefined;
    const timeout = setTimeout(() => setScanFeedback(null), 4000);
    return () => clearTimeout(timeout);
  }, [scanFeedback]);

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

        {/* Bus en tiempo real (ms-gps) */}
        {busCoordinate && (
          <Marker
            coordinate={busCoordinate}
            title={t("gps.vehicleLocation")}
            rotation={Number(location.course) || 0}
            anchor={{ x: 0.5, y: 0.5 }}
          >
            <View style={styles.busMarker}>
              <FontAwesome5 name="bus" size={19} color="#FFFFFF" />
            </View>
          </Marker>
        )}
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

      {/* Aviso del último escaneo: éxito, repetido o rechazo del backend */}
      {scanFeedback ? (
        <View
          style={[
            styles.scanFeedback,
            scanFeedback.type === "error" ? styles.scanFeedbackError : styles.scanFeedbackSuccess,
            { left: horizontalPadding, right: horizontalPadding },
          ]}
        >
          <Text style={styles.scanFeedbackText}>{scanFeedback.message}</Text>
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
