import React, { useState } from "react";
import { View } from "react-native";
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
        <TopBar config={config.topBar} />
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
