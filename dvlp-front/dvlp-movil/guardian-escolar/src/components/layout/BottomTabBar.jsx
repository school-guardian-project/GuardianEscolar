import React from "react";
import { View, Pressable, Text, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
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
  const navigation = useNavigation();

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
        onPress={() => navigation.navigate("MainPage")}
      >
        <FontAwesome5 name="bus" size={24} color="#FFFFFF" />
        <Text style={styles.label}>{t("bottom.route")}</Text>
      </Pressable>

      {/* Ubicación */}
      <Pressable
        style={styles.tab}
        onPress={onLocationPress}
      >
        <MaterialIcons name="place" size={24} color="#FFFFFF" />
        <Text style={styles.label}>{t("bottom.location")}</Text>
      </Pressable>

      {/* Perfil */}
      <Pressable
        style={styles.tab}
       onPress={() => navigation.navigate("Profile")}
      >
        <Ionicons name="person" size={24} color="#FFFFFF" />
        <Text style={styles.label}>{t("bottom.profile")}</Text>
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
