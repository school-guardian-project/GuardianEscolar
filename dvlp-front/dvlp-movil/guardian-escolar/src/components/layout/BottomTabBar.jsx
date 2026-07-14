import React from "react";
import { View, Pressable, Text, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";
import { useTheme } from "@core/services/ThemeService";

// Icons
import {
  Ionicons,
  MaterialIcons,
  FontAwesome5,
} from "@expo/vector-icons";

export default function BottomTabBar({
  onRoutePress,
  onLocationPress,
  onProfilePress,
}) {
  const { t } = useTranslation();
  const { theme } = useTheme();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.navbarColor,
        },
      ]}
    >
      {/* Rutas */}
      <Pressable
        style={styles.tab}
        onPress={onRoutePress}
      >
        <FontAwesome5 name="bus" size={24} color="#FFFFFF" />
        <Text style={styles.label}>{t("route")}</Text>
      </Pressable>

      {/* Ubicación */}
      <Pressable
        style={styles.tab}
        onPress={onLocationPress}
      >
        <MaterialIcons name="place" size={24} color="#FFFFFF" />
        <Text style={styles.label}>{t("location")}</Text>
      </Pressable>

      {/* Perfil */}
      <Pressable
        style={styles.tab}
        onPress={onProfilePress}
      >
        <Ionicons name="person" size={24} color="#FFFFFF" />
        <Text style={styles.label}>{t("profile")}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 72,
    flexDirection: "row",
  },

  tab: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  label: {
    fontSize: 10,
    color: "#FFFFFF",
    marginTop: 4,
  },
});