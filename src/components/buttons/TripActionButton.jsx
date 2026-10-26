import React, { useMemo } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { useTheme } from "@core/services/ThemeService";

export default function TripActionButton({ status, direction, schedule, onStart, onEnd, showWhenEnded = false }) {
  const { theme } = useTheme();

  const label = useMemo(() => {
    if (status === "idle") {
      if (!schedule?.startTime) return "Comenzar ruta";
      const now = new Date();
      const [sh, sm] = schedule.startTime.split(":").map(Number);
      const start = new Date();
      start.setHours(sh, sm || 0, 0, 0);
      const diff = (start - now) / 60000;
      return diff <= 5 && diff >= -60 ? "Comenzar ruta" : null;
    }
    if (status === "active") {
      return direction === "Ida" ? "Terminar ruta" : "Terminar ruta";
    }
    if (status === "ended") return "Viaje finalizado";
    return null;
  }, [status, direction, schedule?.startTime]);

  if (!label) return null;

  const isEnded = status === "ended";
  const isActive = status === "active";

  const bgColor = isEnded
    ? theme.textSecondary
    : isActive
    ? theme.alertIcon
    : theme.buttonApply;

  return (
    <Pressable
      style={[styles.button, { backgroundColor: bgColor }, isEnded && styles.buttonEnded]}
      onPress={isEnded ? undefined : isActive ? onEnd : onStart}
      disabled={isEnded}
    >
      <Text style={[styles.buttonText, isEnded && styles.buttonTextEnded]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    minWidth: 160,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonEnded: {
    opacity: 0.7,
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 14,
  },
  buttonTextEnded: {
    opacity: 0.8,
  },
});

export default TripActionButton;