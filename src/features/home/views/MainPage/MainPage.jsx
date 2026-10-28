import React, { useState, useEffect, useCallback } from "react";
import { View, Text, ActivityIndicator } from "react-native";
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
import TripActionButton from "@components/buttons/TripActionButton";
import { getSession } from "@core/services/authService";
import { resolveRouteForRole } from "@core/services/visibleRouteService";
import { normalizeStops } from "@features/gps/routeMapData";
import RouteMap from "@features/home/components/RouteMap";
import { startTripApi, getTripStatusApi } from "@core/services/tripApi";
import { scanCredential } from "@core/services/notificationApi";
import { apiPost } from "@core/services/apiClient";

import styles from "./MainPage.style";

function MainPageContent() {
  const { width } = useWindow();
  const insets = useSafeAreaInsets();
  const horizontalPadding = width < 360 ? 12 : 16;
  const navigation = useNavigation();
  const { role } = useSession();
  const { t } = useTranslation();
  const isFocused = useIsFocused();

  const config = roleConfig[role] ?? roleConfig["student"];
  const [modalType, setModalType] = useState(null);
  const [incidentOpen, setIncidentOpen] = useState(false);
  const [routeInfo, setRouteInfo] = useState(null);
  const [routeStops, setRouteStops] = useState([]);
  const [status, setStatus] = useState(null);
  const [, setLoading] = useState(true);
  const [scanFeedback, setScanFeedback] = useState(null);
  // Estados del viaje - ahora controlados por backend
  const [tripStatus, setTripStatus] = useState("idle"); // 'idle' | 'ready_to_start' | 'active' | 'ended'
  const [tripDirection, setTripDirection] = useState(null); // 'Ida' | 'Vuelta'
  const [tripSchedule, setTripSchedule] = useState({ startTime: null, endTime: null });
  const [currentTripId, setCurrentTripId] = useState(null);
  // Nuevos estados para control de botones desde backend
  const [canStart, setCanStart] = useState(false);
  const [canEnd, setCanEnd] = useState(false);
  const [endConditionDetail, setEndConditionDetail] = useState(null);
  
  // GPS Tracking (solo si está enfocada la pantalla)
  const { location } = useGpsTracking(undefined, isFocused);

  // Polling del estado del viaje desde backend (solo para conductor)
  const pollTripStatus = useCallback(async () => {
    if (role !== "driver") return;
    
    try {
      const session = await getSession();
      if (!session?.profileId) return;

      const tripStatusData = await getTripStatusApi(session.profileId);
      if (tripStatusData) {
        setCanStart(tripStatusData.CanStart ?? false);
        setCanEnd(tripStatusData.CanEnd ?? false);
        setEndConditionDetail(tripStatusData.EndConditionDetail ?? null);
        
        // Mapear status del backend a estado local
        if (tripStatusData.Status === "Ended") {
          setTripStatus("ended");
        } else if (tripStatusData.Status === "InProgress" || tripStatusData.Status === "ReadyToEnd") {
          setTripStatus("active");
        } else if (tripStatusData.Status === "ReadyToStart" || tripStatusData.CanStart) {
          setTripStatus("ready_to_start");
        } else {
          setTripStatus("idle");
        }
        
        if (tripStatusData.TripId && tripStatusData.TripId !== "00000000-0000-0000-0000-000000000000") {
          setCurrentTripId(tripStatusData.TripId);
        }
        if (tripStatusData.Direction) {
          setTripDirection(tripStatusData.Direction);
        }
        if (tripStatusData.ScheduleStartTime) {
          setTripSchedule({
            startTime: tripStatusData.ScheduleStartTime,
            endTime: tripStatusData.NextScheduleTime
          });
        }
      }
    } catch (error) {
      console.warn("Error polling trip status:", error);
    }
  }, [role]);

  // Iniciar polling cuando la pantalla está enfocada y el rol es conductor
  useEffect(() => {
    if (!isFocused || role !== "driver") return;

    // Ejecutar inmediatamente
    pollTripStatus();
    
    // Polling cada 10 segundos
    const interval = setInterval(pollTripStatus, 10000);
    
    return () => clearInterval(interval);
  }, [isFocused, role, pollTripStatus]);

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
      // Actualizar estado local optimistamente, el polling confirmará
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
      // Forzar polling inmediato
      pollTripStatus();
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
      // El polling actualizará a "ended"
      setScanFeedback({
        type: "success",
        message: t("cards.tripEnded") || "Viaje finalizado correctamente",
      });
      pollTripStatus();
    } catch (error) {
      setScanFeedback({
        type: "error",
        message: error?.data?.message ?? t("serviceErrors.requestFailed"),
      });
    }
  };

  const handleQrScan = async (qrToken) => {
    try {
      // Contrato de ms-notification: solo qrToken. El backend resuelve viaje,
      // parada, estudiante y el tipo de movimiento (subida/bajada) a partir del
      // estado del viaje, y lo devuelve en `boardingType` para elegir el mensaje.
      const result = await scanCredential(qrToken);
      handleCloseModal();

      // El driver necesita saber que el sistema ya hizo lo suyo: sin esto el
      // escaneo cerraba el modal y no confirmaba nada. `alreadyProcessed`
      // distingue un registro nuevo de un movimiento que ya se había notificado.
      setScanFeedback({
        type: "success",
        message: result?.alreadyProcessed
          ? t("cards.scanAlready")
          : result?.boardingType === "OFF_BOARD"
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
    if (!isFocused) return;
    let mounted = true;
    setRouteInfo(null);
    setRouteStops([]);
    setStatus(null);
    async function loadRouteInfo() {
      try {
        const session = await getSession();
        // Resuelve la ruta visible por rol con los endpoints reales de
        // ms-route: el padre usa la ruta del estudiante vinculado (FR-9.1)
        // en lugar de caer al listado general, que exige permisos de admin.
        const { route, note } = await resolveRouteForRole(role, session);
        if (!mounted) return;
        setStatus(note);

        if (!route) {
          setRouteInfo(null);
          return;
        }

        setRouteStops(normalizeStops(route));

        const schedule =
          route.startTime && route.endTime
            ? `${route.startTime} - ${route.endTime}`
            : "";
        // /routes/today y /routes/student/{id} devuelven RouteDetailDto: no traen
        // stopsCount, sino el listado stops. /routes (respaldo) sí trae stopsCount.
        const stopsTotal = route.stops?.length ?? route.stopsCount;
        const stopsCount =
          stopsTotal != null && stopsTotal !== "" ? String(stopsTotal) : "—";

        setRouteInfo({
          routeId: route.id,
          busId: route.bus?.id,
          routeName: route.name ?? "",
          driverName: route.bus?.driverName ?? "",
          plate: route.bus?.plate ?? "",
          schedule,
          stopsCount,
          direction: route.schedules?.[0]?.direction ?? null,
          finalDestination: route.targetSector ?? "",
          startTime: route.startTime,
          endTime: route.endTime,
        });
      } catch (error) {
        console.error("Error loading route info:", error);
        if (mounted) setStatus("No fue posible verificar la ruta asignada.");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadRouteInfo();
    return () => { mounted = false; };
  }, [role, isFocused]);

  // Extract direction from route schedules
  useEffect(() => {
    if (routeInfo?.direction) {
      setTripDirection(routeInfo.direction);
    }
    if (routeInfo?.startTime && routeInfo?.endTime) {
      setTripSchedule({ startTime: routeInfo.startTime, endTime: routeInfo.endTime });
    }
  }, [routeInfo]);

  // El aviso del escaneo se retira solo: el driver no debe cerrarlo a mano
  // para volver a la operación.
  useEffect(() => {
    if (!scanFeedback) return undefined;
    const timeout = setTimeout(() => setScanFeedback(null), 4000);
    return () => clearTimeout(timeout);
  }, [scanFeedback]);

  return (
    <View style={styles.container}>
      <RouteMap stops={routeStops} vehicleLocation={location} />

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

      {/* Tarjeta y navegacion ancladas al borde inferior. */}
      <View style={styles.bottomSection}>
        <RouteInfoCard
          routeName={routeInfo?.routeName ?? ""}
          driverName={routeInfo?.driverName ?? ""}
          plate={routeInfo?.plate ?? ""}
          schedule={routeInfo?.schedule ?? ""}
          stopsCount={routeInfo?.stopsCount ?? ""}
          finalDestination={routeInfo?.finalDestination ?? ""}
        />
        <BottomTabBar
          bottomInset={insets.bottom}
          onRoutePress={() => navigation.navigate("MainPage")}
          onLocationPress={() => navigation.navigate("LiveTracking")}
          onProfilePress={() => navigation.navigate("Profile")}
        />
      </View>

      <View
        style={[
          styles.overlay,
          {
            paddingHorizontal: horizontalPadding,
          },
        ]}
        pointerEvents="box-none"
      >
        <View style={[styles.qrButtonContainer, { bottom: 280 + insets.bottom }]} pointerEvents="box-none">
          {/* Trip buttons only when route is assigned */}
          {role === "driver" && routeInfo && (
            <TripActionButton
              status={tripStatus}
              direction={tripDirection}
              schedule={tripSchedule}
              onStart={handleStartTrip}
              onEnd={handleEndTrip}
              showWhenEnded={false}
              canStart={canStart}
              canEnd={canEnd}
              endConditionDetail={endConditionDetail}
            />
          )}
        </View>

        {config.card.showIncidentReport && (
          <View style={[styles.incidentButtonContainer, { bottom: 280 + insets.bottom }]} pointerEvents="box-none">
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
      <QRScannerModal
        visible={modalType === "qrScanner"}
        onClose={handleCloseModal}
        onScan={handleQrScan}
      />
    </View>
  );
}

/**
 * Puerta de sesión: el contenido solo monta cuando `initialized` (rol leído
 * desde SecureStore por RoleSwitcherProvider) ya es true. El early return vive
 * en un componente que solo usa useSession, así la cantidad de hooks NO cambia
 * entre renders (rules of hooks) y mientras carga no se abren efectos ni GPS.
 */
export default function MainPage() {
  const { initialized } = useSession();

  // Esperar a que el rol esté inicializado desde SecureStore
  if (!initialized) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#1A56DB" />
        <Text style={{ marginTop: 12, color: "#666" }}>Cargando sesión...</Text>
      </View>
    );
  }

  return <MainPageContent />;
}