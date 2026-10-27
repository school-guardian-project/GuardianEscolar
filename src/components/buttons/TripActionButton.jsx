import React, { useMemo } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { useTheme } from "@core/services/ThemeService";

export default function TripActionButton({ 
  status, 
  direction, 
  schedule, 
  onStart, 
  onEnd, 
  showWhenEnded = false,
  // Nuevas props del backend
  canStart = false,
  canEnd = false,
  endConditionDetail = null
}) {
  const { theme } = useTheme();

  const label = useMemo(() => {
    // Si el viaje ya terminó
    if (status === "ended") return "Viaje finalizado";
    
    // Si el viaje está activo, mostrar "Terminar ruta" solo si canEnd=true
    if (status === "active") {
      return canEnd ? "Terminar ruta" : "Viaje en curso";
    }
    
    // Si está idle, mostrar "Comenzar ruta" solo si canStart=true
    if (status === "idle" || status === "ready_to_start") {
      return canStart ? "Comenzar ruta" : null;
    }
    
    return null;
  }, [status, canStart, canEnd]);

  // Mensaje informativo para el botón deshabilitado
  const helperText = useMemo(() => {
    if (status === "active" && !canEnd && endConditionDetail?.Message) {
      return endConditionDetail.Message;
    }
    if (status === "idle" && !canStart && endConditionDetail?.Message) {
      return endConditionDetail.Message;
    }
    return null;
  }, [status, canStart, canEnd, endConditionDetail]);

  if (!label && !helperText) return null;

  const isEnded = status === "ended";
  const isActive = status === "active";
  const isDisabled = isEnded || (status === "active" && !canEnd) || (status === "idle" && !canStart);

  const bgColor = isEnded
    ? theme.textSecondary
    : isActive
    ? theme.alertIcon
    : theme.buttonApply;

  return (
    <View style={styles.container}>
      <Pressable
        style={[
          styles.button, 
          { backgroundColor: isDisabled ? theme.textSecondary : bgColor }, 
          isEnded && styles.buttonEnded
        ]}
        onPress={isDisabled ? undefined : isActive ? onEnd : onStart}
        disabled={isDisabled}
      >
        <Text style={[styles.buttonText, isEnded && styles.buttonTextEnded]}>{label}</Text>
      </Pressable>
      {helperText && (
        <Text style={styles.helperText}>{helperText}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    alignItems: "center",
  },
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
  helperText: {
    marginTop: 6,
    fontSize: 11,
    color: "#666",
    textAlign: "center",
    maxWidth: 280,
  },
});

