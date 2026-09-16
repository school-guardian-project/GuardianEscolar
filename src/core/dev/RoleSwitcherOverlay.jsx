import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useRoleSwitcher } from "./RoleSwitcherContext";
import { StyleSheet } from "react-native";

const ROLES = [
  { key: "student", label: "🎓 Estudiante" },
  { key: "driver", label: "🚌 Conductor" },
  { key: "father", label: "👨‍👩‍👧 Padre" },
];

export default function RoleSwitcherOverlay() {
  const { role, setRole } = useRoleSwitcher();
  if (!__DEV__) return null; // nunca en producción

  return (
    <View style={styles.container} pointerEvents="box-none">
      <View style={styles.pill}>
        {ROLES.map((r) => (
          <TouchableOpacity
            key={r.key}
            style={[styles.option, role === r.key && styles.optionActive]}
            onPress={() => setRole(r.key)}
          >
            <Text
              style={[
                styles.optionText,
                role === r.key && styles.optionTextActive,
              ]}
            >
              {r.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 90,
    left: 0,
    right: 0,
    alignItems: "center",
    zIndex: 999,
    elevation: 999,
  },
  pill: {
    flexDirection: "row",
    backgroundColor: "#111",
    borderRadius: 24,
    padding: 4,
  },
  option: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 20 },
  optionActive: { backgroundColor: "#4ADE80" },
  optionText: { color: "#fff", fontSize: 12 },
  optionTextActive: { color: "#111", fontWeight: "600" },
});
