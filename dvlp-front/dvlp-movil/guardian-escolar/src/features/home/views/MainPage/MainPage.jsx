import React, { useState, useEffect } from "react";
import { View } from "react-native";
import MapView from "react-native-maps";
import { useSafeAreaInsets } from "react-native-safe-area-context";
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

export default function MainPage() {
  const { width } = useWindow();
  const insets = useSafeAreaInsets();
  const horizontalPadding = width < 360 ? 12 : 16;
  const navigation = useNavigation();
  const { role } = useSession();
  const config = roleConfig[role];

  const [modalType, setModalType] = useState(null);
  const [routeInfo, setRouteInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleOpenModal = (type) => setModalType(type);
  const handleCloseModal = () => setModalType(null);

  const handleQrScan = async (data) => {
    try {
      const qrData = JSON.parse(data);
      const session = await getSession();
      const routes = await getRouteApi("/routes");
      const route = routes[0];

      if (!route) return;

      await postNotificationApi("/v1/notifications/scan", {
        routeExecutionId: route.id,
        studentProfileId: qrData.id,
        routeStopId: qrData.routeStopId || route.id,
        boardingType: "ON_BOARD",
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

        const routes = await getRouteApi("/routes");
        const route = routes[0];

        if (!route) {
          setLoading(false);
          return;
        }

        let driverName = "";
        let plate = "";

        if (role === "driver") {
          const buses = await getFleetApi("/buses");
          const bus = buses.find((b) => b.campuseId === route.campuseId);
          if (bus) {
            plate = bus.plate;
            driverName = "Conductor";
          }
        }

        setRouteInfo({
          routeName: route.name,
          driverName,
          plate,
          schedule: route.targetSector,
          stopsCount: "—",
          finalDestination: route.targetSector,
        });
      } catch (error) {
        console.error("Error loading route info:", error);
      } finally {
        setLoading(false);
      }
    }

    loadRouteInfo();
  }, [role]);

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 2.9273,
          longitude: -75.2819,
          latitudeDelta: 0.08,
          longitudeDelta: 0.08,
        }}
      />

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

      <QRScannerModal
        visible={modalType === "qrScanner"}
        onClose={handleCloseModal}
        onScan={handleQrScan}
      />
    </View>
  );
}
