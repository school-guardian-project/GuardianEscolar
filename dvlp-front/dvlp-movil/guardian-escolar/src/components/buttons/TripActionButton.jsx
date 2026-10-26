import React from "react";
import { Pressable, Text, StyleSheet } from "react-native";
import { useTheme } from "@core/services/ThemeService";
import { useTranslation } from "react-i18next";

/**
 * TripActionButton - Botón contextual para iniciar/terminar viajes según estado y dirección.
 * 
 * Estados:
 * - idle + 5min antes de StartTime: "Iniciar Ruta" (azul, theme.buttonApply)
 * - active + Direction="Ida": "Terminar en Colegio" (rojo, theme.alertIcon)
 * - active + Direction="Vuelta": "Terminar en Última Parada" (rojo, theme.alertIcon)
 * - ended: "Viaje Finalizado" (gris) u oculto (showWhenEnded prop)
 */
export default function TripActionButton({
  tripStatus,        // 'idle' | 'active' | 'ended'
  tripDirection,     // 'Ida' | 'Vuelta'
  tripSchedule,      // { startTime: "HH:mm", endTime: "HH:mm" }
  onStartTrip,       // handler para iniciar viaje
  onEndTrip,         // handler para terminar viaje
  showWhenEnded = false, // si true muestra "Viaje Finalizado", si false oculta
}) {
  const { theme } = useTheme();
  const { t } = useTranslation();

  // Calcular si estamos a 5 min o menos del StartTime
  const isWithinStartWindow = React.useMemo(() => {
    if (!tripSchedule?.startTime) return false;
    const now = new Date();
    const [sh, sm] = tripSchedule.startTime.split(":").map(Number);
    const start = new Date();
    start.setHours(sh, sm || 0, 0, 0);
    const diffMinutes = (start - now) / 60000;
    return diffMinutes <= 5 && diffMinutes >= -60; // 5 min antes hasta 60 min después
  }, [tripSchedule?.startTime]);

  // Determinar qué mostrar
  const getButtonConfig = () => {
    if (tripStatus === "ended") {
      if (!showWhenEnded) return null;
      return {
        text: t("cards.tripEnded") || "Viaje Finalizado",
        backgroundColor: theme.textSecondary,
        onPress: () => {},
        disabled: true,
      };
    }

    if (tripStatus === "active") {
      const isIda = tripDirection === "Ida";
      return {
        text: isIda
          ? t("cards.endAtSchool") || "Terminar en Colegio"
          : t("cards.endAtLastStop") || "Terminar en Última Parada",
        backgroundColor: theme.alertIcon,
        onPress: onEndTrip,
        disabled: false,
      };
    }

    // idle
    if (isWithinStartWindow) {
      return {
        text: t("cards.startRoute") || "Iniciar Ruta",
        backgroundColor: theme.buttonApply,
        onPress: onStartTrip,
        disabled: false,
      };
    }

    return null; // No mostrar nada si no estamos en la ventana de inicio
  };

  const config = getButtonConfig();
  if (!config) return null;

  return (
    <Pressable
      style={[
        styles.button,
        { backgroundColor: config.backgroundColor },
        config.disabled && styles.buttonDisabled,
      ]}
      onPress={config.onPress}
      disabled={config.disabled}
      accessibilityRole="button"
      accessibilityLabel={config.text}
    >
      <Text style={styles.buttonText}>{config.text}</Text>
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
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
});