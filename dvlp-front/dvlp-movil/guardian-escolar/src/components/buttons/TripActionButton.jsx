import React, { useMemo } from "react";
import { Pressable, StyleSheet, Text } from "react-native";
import { useTranslation } from "react-i18next";
import { useTheme } from "@core/services/ThemeService";

/**
 * Botón contextual para acciones de viaje (iniciar/terminar).
 *
 * Estados visuales según props:
 * - idle + 5min antes del startTime: "Iniciar Ruta" (azul, estilo primary)
 * - active + Direction="Ida": "Terminar en Colegio" (rojo, estilo danger)
 * - active + Direction="Vuelta": "Terminar en Última Parada" (rojo, estilo danger)
 * - ended: "Viaje Finalizado" (gris, deshabilitado) u oculto
 *
 * Props:
 * - status: 'idle' | 'active' | 'ended'
 * - direction: 'Ida' | 'Vuelta'
 * - schedule: { startTime: "HH:mm", endTime: "HH:mm" }
 * - onStart: () => void
 * - onEnd: () => void
 * - showWhenEnded?: boolean (default: false - oculta en estado ended)
 */
export default function TripActionButton({
  status,
  direction,
  schedule,
  onStart,
  onEnd,
  showWhenEnded = false,
}) {
  const { theme } = useTheme();
  const { t } = useTranslation();

  // Calcular si estamos en la ventana de 5 min antes del startTime
  const isWithinStartWindow = useMemo(() => {
    if (!schedule?.startTime) return false;
    const now = new Date();
    const [sh, sm] = schedule.startTime.split(":").map(Number);
    const start = new Date();
    start.setHours(sh, sm || 0, 0, 0);
    const diffMinutes = (start - now) / 60000;
    return diffMinutes <= 5 && diffMinutes >= -60; // 5 min antes hasta 60 min después
  }, [schedule?.startTime]);

  // Determinar qué renderizar según estado
  if (status === "ended") {
    if (!showWhenEnded) return null;
    return (
      <Pressable
        style={[styles.button, styles.buttonEnded, { backgroundColor: theme.textSecondary }]}
        disabled
        accessibilityRole="button"
        accessibilityLabel={t("trip.ended")}
      >
        <Text style={styles.buttonText}>{t("trip.ended") || "Viaje Finalizado"}</Text>
      </Pressable>
    );
  }

  if (status === "active") {
    const isReturn = direction === "Vuelta";
    const label = isReturn
      ? t("trip.endAtLastStop") || "Terminar en Última Parada"
      : t("trip.endAtSchool") || "Terminar en Colegio";

    return (
      <Pressable
        style={[styles.button, styles.buttonActive, { backgroundColor: theme.alertIcon }]}
        onPress={onEnd}
        accessibilityRole="button"
        accessibilityLabel={label}
      >
        <Text style={styles.buttonText}>{label}</Text>
      </Pressable>
    );
  }

  // status === 'idle'
  if (!isWithinStartWindow) {
    return null; // No mostrar botón fuera de la ventana
  }

  return (
    <Pressable
      style={[styles.button, styles.buttonIdle, { backgroundColor: theme.buttonApply }]}
      onPress={onStart}
      accessibilityRole="button"
      accessibilityLabel={t("trip.startRoute") || "Iniciar Ruta"}
    >
      <Text style={styles.buttonText}>{t("trip.startRoute") || "Iniciar Ruta"}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    minWidth: 180,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  buttonIdle: {
    // Azul (primary) - usa theme.buttonApply
  },
  buttonActive: {
    // Rojo (danger) - usa theme.alertIcon
  },
  buttonEnded: {
    // Gris - usa theme.textSecondary
  },
});