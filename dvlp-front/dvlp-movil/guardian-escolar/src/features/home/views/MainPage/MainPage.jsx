import React from "react";
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

import styles from "./MainPage.style";

export default function MainPage() {
  const { width } = useWindow();
  const insets = useSafeAreaInsets();
  const horizontalPadding = width < 360 ? 12 : 16;
  const navigation = useNavigation();
  const { role } = useSession();
  const config = roleConfig[role];

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
        pointerEvents="box-none"
        style={[
          styles.overlay,
          {
            paddingHorizontal: horizontalPadding,
            paddingTop: Math.max(insets.top, 12),
            paddingBottom: 0,
          },
        ]}
      >
        <TopBar config={config.topBar} />

        <View style={[styles.bottomSection, { marginHorizontal: -horizontalPadding }]}>
          <RouteInfoCard />
          <BottomTabBar
            onRoutePress={() => navigation.navigate("MainPage")}
            onLocationPress={() => navigation.navigate("Location")}
            onProfilePress={() => navigation.navigate("Profile")}
          />
        </View>
      </View>
    </View>
  );
}
