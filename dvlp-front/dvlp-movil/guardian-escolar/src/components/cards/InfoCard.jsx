import React from "react";
import { View, StyleSheet } from "react-native";
import { useTheme } from "@core/services/ThemeService";

export default function InfoCard({ children }) {
  const { theme } = useTheme();

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.cardSecondaryBg,
          borderColor: theme.borderColor,
        },
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 18,
    overflow: "hidden",
    marginBottom: 18,
  },
});