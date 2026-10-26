import React, { useState, useEffect, useRef } from "react";
import { View, Text } from "react-native";
import MapView, { Marker } from "react-native-maps";
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
import TripActionButton from "@components/buttons/TripActionButton";
import QRDisplayModal from "@components/modals/QRDisplayModal";
import QRScannerModal from "@components/modals/QRScannerModal";
import IncidentReportModal from "@components/modals/IncidentReportModal";
import { getSession } from "@core/services/authService";
import { getRouteApi } from "@core/services/routeApi";
import { startTripApi } from "@core/services/tripApi";
import { getLinkedStudents } from "@core/services/familyService";
import { scanCredential } from "@core/services/notificationApi";
import { apiPost } from "@core/services/apiClient";

import styles from "./MainPage.style";

/** GET a ms-route que devuelve null en vez de propagar el error. */
async function fetchRoute(path) {
  try {
    return await getRouteApi(path);
  } catch (error) {
    console.error(`[fetchRoute] Error fetching ${path}:`, {
      status: error?.status,
      message: error?.message,
      data: error?.data,
    });
    return null;
  }
}

/**
 * Ruta visible para el rol autenticado, con el aviso que corresponde cuando
 * no hay una que mostrar:
 * - student: su propia ruta asignada.
 * - driver:  su ruta del día, solo dentro de la ventana activa.
 * - parent:  la ruta del estudiante vinculado (FR-9.1).
 * - otros:   primera ruta, como respaldo.
 */
async function resolveRouteForRole(role, session) {
  // Validador: asegura que la respuesta tenga id (RouteDto mínimo)
  const isValidRoute = (r) => r && typeof r === "object" && (r.id || r.routeId);

  if (role === "student") {
    const route = await fetchRoute(`/routes/student/${session.profileId}`);
    const valid = isValidRoute(route) ? route : null;
    return { route: valid, note: valid ? null : "Aún no tienes una ruta asignada." };
  }

  if (role === "driver") {
    const today = await fetchRoute(`/routes/today?driverId=${session.profileId}`);
    // Estructura esperada: { status: "ACTIVE"|"SCHEDULED", route: RouteDto, nextOccurrence?: string }
    if (today && typeof today === "object" && today.status === "ACTIVE" && isValidRoute(today.route)) {
      return { route: today.route, note: null };
    }
    // SCHEDULED trae la próxima salida: decir "sin ruta" confundía al conductor.
    if (today && typeof today === "object" && today.status === "SCHEDULED" && today.nextOccurrence) {
      const next = new Date(today.nextOccurrence).toLocaleString("es-CO", {
        weekday: "long",
        hour: "2-digit",
        minute: "2-digit",
      });
      return { route: null, note: `Tu próximo recorrido es el ${next}.` };
    }
    return { route: null, note: "No hay una ruta asignada." };
  }

  if (role === "parent") {
    const [student] = await getLinkedStudents(session);
    if (!student) {
      return { route: null, note: "No hay estudiantes vinculados a tu cuenta." };
    }
    const route = await fetchRoute(`/routes/student/${student.profileId}`);
    const valid = isValidRoute(route) ? route : null;
    return { route: valid, note: valid ? null : "El estudiante aún no tiene una ruta asignada." };
  }

  const routes = await fetchRoute("/routes");
  const first = Array.isArray(routes) && routes.length > 0 && isValidRoute(routes[0]) ? routes[0] : null;
  return { route: first, note: null };
}

export default function MainPage() {
  const { width } = useWindow();
  const insets = useSafeAreaInsets();
  const horizontalPadding = width < 360 ? 12 : 16;
  const navigation = useNavigation();
  const { role, initialized } = useSession();
  const { t } = useTranslation();
  const isFocused = useIsFocused();
  
  // Esperar a que el rol esté inicializado desde SecureStore
  if (!initialized) {
    return null; // o un spinner si prefieres
  }
  
  const config = roleConfig[role];
  const [modalType, setModalType] = useState(null);
  const [incidentOpen, setIncidentOpen] = useState(false);
  const [routeInfo, setRouteInfo] = useState(null);
  const [, setLoading] = useState(true);
  const [scanMode, setScanMode] = useState("ON_BOARD");
  const [status, setStatus] = useState(null);
  const [scanFeedback, setScanFeedback] = useState(null);
  
  // Unified trip state
  const [tripStatus, setTripStatus] = useState("idle"); // 'idle' | 'active' | 'ended'
  const [tripDirection, setTripDirection] = useState(null); // 'Ida' | 'Vuelta'
  const [tripSchedule, setTripSchedule] = useState({ startTime: null, endTime: null });
  const [currentTripId, setCurrentTripId] = useState(null);
  const mapRef = useRef(null);

  // GPS Tracking (solo si está enfocada la pantalla)
  const { location } = useGpsTracking(undefined, isFocused);
  const busLatitude = Number(location?.latitude);
  const busLongitude = Number(location?.longitude);
  const busCoordinate =
    location && Number.isFinite(busLatitude) && Number.isFinite(busLongitude)
      ? { latitude: busLatitude, longitude: busLongitude }
      : null;

  const handleOpenModal = (type) => setModalType(type);
  const handleCloseModal = () => setModalType(null);

  const handleStartTrip = async () => {
    try {
      const session = await getSession();
      if (!session?.profileId || !routeInfo) return;

      const payload = {
        routeId: routeInfo.routeId,
        busId: routeInfo.busId,
        driverId: session.profileId,
      };

      const result = await startTripApi(payload);
      setTripStatus("active");
      if (result?.id) {
        setCurrentTripId(result.id);
      } else if (result?.tripId) {
        setCurrentTripId(result.tripId);
      }
      setScanFeedback({
        type: "success",
        message: t("cards.tripStarted") || "Viaje iniciado correctamente",
      });
    } catch (error) {
      setScanFeedback({
        type: "error",
        message: error?.data?.message ?? t("serviceErrors.requestFailed"),
      });
    }
  };

  const handleEndTrip = async () => {
    try {
      if (!currentTripId) {
        setScanFeedback({
          type: "error",
          message: t("serviceErrors.requestFailed") || "No hay un viaje activo para finalizar.",
        });
        return;
      }
      await apiPost(`/route/api/trips/end?tripId=${currentTripId}`, {});
      setTripStatus("ended");
      setScanFeedback({
        type: "success",
        message: t("cards.tripEnded") || "Viaje finalizado correctamente",
      });
    } catch (error) {
      setScanFeedback({
        type: "error",
        message: error?.data?.message ?? t("serviceErrors.requestFailed"),
      });
    }
  };

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
          setRouteInfo(null);
          return;
        }

        // MainPage NO carga geometría OSRM ni paradas en el mapa.
        // Solo muestra info de la ruta (nombre, conductor, bus, horario) + ubicación bus GPS.
        // La sugerencia de ruta (OSRM) es solo para LiveTracking (vista GPS).

        const schedule =
          route.startTime && route.endTime
            ? `${route.startTime} - ${route.endTime}`
            : "";
        const stopsCount =
          route.stopsCount != null && route.stopsCount !== ""
            ? String(route.stopsCount)
            : "—";

        // Extract Direction from route.Schedules[0]?.Direction
        const direction = route.Schedules?.[0]?.Direction ?? null;

        setRouteInfo({
          routeId: route.id,
          busId: route.bus?.id,
          routeName: route.name ?? "",
          driverName: route.bus?.driverName ?? "",
          plate: route.bus?.plate ?? "",
          schedule,
          stopsCount,
          finalDestination: route.targetSector ?? "",
          startTime: route.startTime,
          endTime: route.endTime,
        });
        setTripSchedule({
          startTime: route.startTime,
          endTime: route.endTime,
        });
        setTripDirection(direction);
      } catch (error) {
        console.error("Error loading route info:", error);
        setStatus("No fue posible verificar la ruta asignada.");
      } finally {
        setLoading(false);
      }
    }

    loadRouteInfo();
  }, [role]);

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
      >
        {/* Bus en tiempo real (ms-gps) - ÚNICO elemento en el mapa en MainPage */}
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
          {role === "driver" && (
            <TripActionButton
              tripStatus={tripStatus}
              tripDirection={tripDirection}
              tripSchedule={tripSchedule}
              onStartTrip={handleStartTrip}
              onEndTrip={handleEndTrip}
              showWhenEnded={false}
            />
          )}
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
