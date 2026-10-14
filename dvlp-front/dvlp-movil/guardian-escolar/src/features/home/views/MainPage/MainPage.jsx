import React, { useState } from "react";
import { View, Text, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import RouteInfoCard from "@components/cards/RouteInfoCard";
import BottomTabBar from "@components/layout/BottomTabBar";
import useWindow from "@core/hooks/useWindow";
import TopBar from "@components/TopBar";
import { roleConfig } from "@core/config/roles/roleConfig";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import useSession from "@core/hooks/useSession";
import useGpsTracking from "@features/gps/hooks/useGpsTracking";
import RouteMap from "@features/home/components/RouteMap";
import useRouteMapData from "@features/home/hooks/useRouteMapData";
import QRButtom from "@components/buttons/QRButtom";
import QRDisplayModal from "@components/modals/QRDisplayModal";
import QRScannerModal from "@components/modals/QRScannerModal";
import { getSession } from "@core/services/authService";
import { getRouteApi } from "@core/services/routeApi";
import { postNotificationApi } from "@core/services/notificationApi";
import styles from "./MainPage.style";

const EMPTY_GUID = "00000000-0000-0000-0000-000000000000";

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
  const navigation = useNavigation();
  const { role } = useSession();
  const isFocused = useIsFocused();
  const { routeInfo, routeStops, guardianStudents, selectedStudentId, setSelectedStudentId, status } = useRouteMapData();
  const { location } = useGpsTracking(undefined, isFocused);
  const [modalType, setModalType] = useState(null);
  const [scanMode, setScanMode] = useState("ON_BOARD");
  const horizontalPadding = width < 360 ? 12 : 16;
  const config = roleConfig[role];

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

  return (
    <View style={styles.container}>
      <RouteMap stops={routeStops} vehicleLocation={location} />
      {status ? <View style={styles.routeStatus}><Text style={styles.routeStatusText}>{status}</Text></View> : null}
      {role === "father" && guardianStudents.length > 1 ? (
        <View style={styles.studentSelector}>
          {guardianStudents.map((studentId) => <Pressable key={studentId} onPress={() => setSelectedStudentId(studentId)} style={[styles.studentButton, selectedStudentId === studentId && styles.studentButtonActive]}><Text numberOfLines={1}>{studentId}</Text></Pressable>)}
        </View>
      ) : null}
      <View
        style={[styles.topBarContainer, {
          paddingTop: Math.max(insets.top, 12),
          paddingHorizontal: horizontalPadding,
        }]}
        pointerEvents="box-none"
      >
        <TopBar
          config={config.topBar}
          onNotificationPress={() => navigation.navigate("Notifications")}
        />
      </View>

      <View
        style={[styles.overlay, { paddingHorizontal: horizontalPadding, paddingBottom: 0 }]}
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
          <QRButtom config={config.card} onOpenModel={setModalType} />
        </View>
      </View>

      <QRDisplayModal
        visible={modalType === "activeQR"}
        onClose={() => setModalType(null)}
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
        onClose={() => setModalType(null)}
        onScan={handleQrScan}
      />
    </View>
  );
}
