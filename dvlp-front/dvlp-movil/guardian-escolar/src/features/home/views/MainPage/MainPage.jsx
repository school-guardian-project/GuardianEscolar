import React, { useState, useEffect } from "react";
import { View, Text } from "react-native";
// [MOCK-API] Demo consumo json-server. Para quitar: borrar estas 3 líneas y el useEffect de abajo.
import { API_CONFIG } from "@core/api/api.config";
import { dashboardService, routeService } from "@core/api/services";
import MapView from "react-native-maps";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import RouteInfoCard from "@components/cards/RouteInfoCard";
import BottomTabBar from "@components/layout/BottomTabBar";
import useWindow from "@core/hooks/useWindow";
import TopBar from "@components/TopBar";
import RoleSwitcherOverlay from "@core/dev/RoleSwitcherOverlay";
import { roleConfig } from "@core/config/roles/roleConfig";
import { useNavigation } from "@react-navigation/native";
import useSession from "@core/hooks/useSession";
import QRButtom from "@components/buttons/QRButtom";
import QRDisplayModal from "@components/modals/QRDisplayModal";
import QRScannerModal from "@components/modals/QRScannerModal";

import styles from "./MainPage.style";

export default function MainPage() {
  const { width } = useWindow();
  const insets = useSafeAreaInsets();
  const horizontalPadding = width < 360 ? 12 : 16;
  const navigation = useNavigation();
  const { role } = useSession();
  const config = roleConfig[role];

  const [modalType, setModalType] = useState(null);
  const handleOpenModal = (type) => setModalType(type);
  const handleCloseModal = () => setModalType(null);

  // [MOCK-API] Demo: Cliente -> GET /routes -> GET /route-stops -> DB. Log + estado para demo.
  const [apiStatus, setApiStatus] = useState(API_CONFIG.ENABLED ? "conectando..." : "mock local");
  const [routeCount, setRouteCount] = useState(null);
  useEffect(() => {
    if (!API_CONFIG.ENABLED) return;
    let mounted = true;
    (async () => {
      try {
        const routes = await routeService.list();
        const enriched = await dashboardService.getRoutesWithStops();
        if (mounted) {
          setRouteCount(enriched.length);
          setApiStatus(`API OK: ${enriched.length} rutas`);
          console.log("[MainPage] Cliente -> API -> DB OK", { routes: routes.length, enriched });
        }
      } catch (e) {
        if (mounted) setApiStatus("API no disponible (json-server :3000)");
        console.warn("[MainPage] API fallo", e.message);
      }
    })();
    return () => { mounted = false; };
  }, []);

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

        <View style={[styles.bottomSection, { marginHorizontal: -horizontalPadding}]}>
          {/* [MOCK-API] Badge temporal que prueba el flujo. Para quitar: borrar este bloque */}
          {API_CONFIG.ENABLED ? (
            <View style={{ backgroundColor: "rgba(0,0,0,0.65)", borderRadius: 8, padding: 6, marginBottom: 8, alignItems: "center" }}>
              <Text style={{ color: "#fff", fontSize: 11 }}>{apiStatus}{routeCount !== null ? ` · Cliente→API→DB` : ""}</Text>
            </View>
          ) : null}
          <QRButtom config={config.card} onOpenModel={handleOpenModal} />
          <RouteInfoCard />
          <BottomTabBar
            onRoutePress={() => navigation.navigate("MainPage")}
            onLocationPress={() => navigation.navigate("Location")}
            onProfilePress={() => navigation.navigate("Profile")}
          />
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
        onScan={(data) => console.log("QR escaneado:", data)}
      />

      <RoleSwitcherOverlay />
    </View>
  );
}
