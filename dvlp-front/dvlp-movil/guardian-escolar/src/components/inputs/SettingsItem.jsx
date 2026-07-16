import React from "react";
import { Pressable, View, Text, StyleSheet } from "react-native";
import { useTheme } from "@core/services/ThemeService";

export default function SettingsItem({
  icon,
  title,
  onPress,
}) {
  const { theme } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.container,
        {
          backgroundColor: theme.cardSecondaryBg,
          borderColor: theme.borderColor,
        },
      ]}
    >
      {/* Icono */}
      <View style={styles.icon}>{icon}</View>

      {/* Texto */}
      <Text
        style={[
          styles.title,
          { color: theme.textColor },
        ]}
      >
        {title}
      </Text>

      {/* Flecha */}
      <Text
        style={[
          styles.arrow,
          { color: theme.textSecondary },
        ]}
      >
        ›
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 60,
    borderRadius: 18,
    borderWidth: 1,
    paddingHorizontal: 16,

    flexDirection: "row",
    alignItems: "center",
  },

  icon: {
    width: 26,
    height: 26,
    alignItems: "center",
    justifyContent: "center",
  },

  title: {
    flex: 1,
    marginLeft: 15,
    fontSize: 17,
  },

  arrow: {
    fontSize: 22,
    fontWeight: "bold",
  },
});
