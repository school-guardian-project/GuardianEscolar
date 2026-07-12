import React from "react";
import { Pressable, Text, StyleSheet } from "react-native";
import { useTheme } from "@core/services/ThemeService";

export default function NotificationButton({ onPress }) {
  const { theme } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.button,
        {
          backgroundColor: theme.cardBg,
          borderColor: theme.borderColor,
        },
      ]}
    >
      <Text
        style={[
          styles.icon,
          { color: theme.textColor },
        ]}
      >
        🔔
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 50,
    height: 50,
    borderRadius: 15,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  icon: {
    fontSize: 24,
  },
});