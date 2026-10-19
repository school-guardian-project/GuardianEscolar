import React from "react";
import { Pressable, StyleSheet } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useTranslation } from "react-i18next";
import { useTheme } from "@core/services/ThemeService";

/**
 * Boton flotante para reportar un incidente o emergencia (FR-8.1).
 *
 * Solo lo ve el conductor: MainPage lo pinta cuando
 * `roleConfig.card.showIncidentReport` esta activo. Va en rojo a proposito, para
 * que se distinga del QR (accion del dia a dia) en una emergencia.
 */
export default function IncidentReportButton({ onPress }) {
  const { theme } = useTheme();
  const { t } = useTranslation();

  return (
    <Pressable
      style={[styles.button, { backgroundColor: theme.alertIcon }]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={t("incidents.open")}
    >
      <Ionicons name="alert-circle-outline" size={30} color="#FFFFFF" />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
  },
});
