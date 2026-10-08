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
import { getFleetApi } from "@core/services/fleetApi";
import { postNotificationApi } from "@core/services/notificationApi";

import styles from "./MainPage.style";

const EMPTY_GUID = "00000000-0000-0000-0000-000000000000";

// RouteDetailDto.stops -> coordenadas validas ordenadas por orderSequence.
// Lat/lng llegan como decimales serializados, por eso se normalizan a Number.
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
        !(stop.latitude === 0 && stop.longitude === 0)
    )
    .sort((a, b) => a.orderSequence - b.orderSequence);
}

async function getCurrentTrip(driverId) {
  if (!driverId) return null;

  try {
    return await getRouteApi(`/trips/current?driverId=${driverId}`);
  } catch {
    return null;
  }
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
  const [loading, setLoading] = useState(true);
  const [scanMode, setScanMode] = useState("ON_BOARD");

  const mapRef = useRef(null);
  const mapReadyRef = useRef(false);
  const stopsRef = useRef([]);

  // Encuadra el mapa sobre las paradas de la ruta (si las hay).
  const fitStopsOnMap = () => {
    const stops = stopsRef.current;
    if (!mapReadyRef.current || stops.length === 0) return;

    mapRef.current?.fitToCoordinates(
      stops.map((stop) => ({ latitude: stop.latitude, longitude: stop.longitude })),
      {
        edgePadding: { top: 90, right: 40, bottom: 280, left: 40 },
        animated: true,
      }
    );
  };

  const handleOpenModal = (type) => setModalType(type);
  const handleCloseModal = () => setModalType(null);

  const handleQrScan = async (data) => {
    try {
      const qrData = JSON.parse(data);
      const session = await getSession();
      const routes = await getRouteApi("/routes");
      const route = routes[0];

      if (!route) return;

      const trip = await getCurrentTrip(session?.profileId);

      await postNotificationApi("/v1/notifications/scan", {
        routeId: route.id,
        routeExecutionId: trip?.id ?? EMPTY_GUID,
        studentProfileId: qrData.id,
        routeStopId: qrData.routeStopId || EMPTY_GUID,
        boardingType: scanMode,
      });
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

        let route = null;

        // Cargar ruta según el rol del usuario
        if (role === "student") {
          // Estudiante: obtener su ruta asignada
          try {
            route = await getRouteApi(`/routes/student/${session.profileId}`);
          } catch {
            route = null;
          }
        } else if (role === "driver") {
          // Conductor: el backend valida el horario. Solo si la ruta esta
          // Solo se muestran paradas cuando la ruta esta ACTIVA.
          try {
            const today = await getRouteApi(
              `/routes/today?driverId=${session.profileId}`
            );

            if (today?.status === "ACTIVE" && today.route) {
              route = today.route;
            } else {
              route = null;
            }
          } catch {
            route = null;
          }
        } else {
          // Otros roles: obtener primera ruta (fallback)
          const routes = await getRouteApi("/routes");
          route = routes[0];
        }

        if (!route) {
          stopsRef.current = [];
          setRouteStops([]);
          setLoading(false);
          return;
        }

        let driverName = "";
        let plate = "";

        if (role === "driver") {
          const buses = await getFleetApi("/buses");
          const bus = buses.find((b) => b.campuseId === route.campuseId);
          if (bus) {
            plate = bus.plate ?? "";
            driverName = bus.driverName ?? "";
          }
        }

        // RouteDetailDto (conductor/estudiante) incluye stops[];
        // RouteListDto solo trae stopsCount.
        const stops = normalizeStops(route);
        stopsRef.current = stops;
        setRouteStops(stops);

        // RouteListDto: horario real = startTime/endTime; targetSector es el destino.
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
          routeName: route.name,
          driverName,
          plate,
          schedule,
          stopsCount,
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
      </View>

      <QRDisplayModal
        visible={modalType === "activeQR"}
        onClose={handleCloseModal}
        studentData={null}
      />

      {modalType === "qrScanner" && (
        <View style={styles.scanModeContainer}>
          <Pressable
            style={[styles.scanModeButton, scanMode === "ON_BOARD" && styles.scanModeActive]}
            onPress={() => setScanMode("ON_BOARD")}
          >
            <Text style={styles.scanModeText}>ABORDAR</Text>
          </Pressable>
          <Pressable
            style={[styles.scanModeButton, scanMode === "OFF_BOARD" && styles.scanModeActive]}
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
