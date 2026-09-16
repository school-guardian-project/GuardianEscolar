import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTheme } from "@core/services/ThemeService";
import QRCode from "react-native-qrcode-svg";
import BaseModal from "@components/modals/BaseModal";

export default function QRDisplayModal({ visible, onClose, studentData }) {
  const { theme } = useTheme();

  const qrValue = studentData
    ? JSON.stringify({
        id: studentData.id,
        name: studentData.name,
        route: studentData.route,
      })
    : "guardian-escolar-demo-qr";

  return (
    <BaseModal visible={visible} onClose={onClose} animationType="slide">
      <View style={[styles.container, { backgroundColor: theme.cardBg }]}>
        <Text style={[styles.title, { color: theme.textColor }]}>
          Código QR del Estudiante
        </Text>

        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
          Presenta este código al conductor
        </Text>

        <View style={styles.qrWrapper}>
          {qrValue ? (
            <QRCode
              value={qrValue}
              size={220}
              bgColor="#FFFFFF"
              fgColor="#000000"
            />
          ) : (
            <Text style={{ color: theme.textSecondary }}>
              Cargando datos...
            </Text>
          )}
        </View>

        <Text style={[styles.hint, { color: theme.textSecondary }]}>
          Escanea para confirmar tu asistencia
        </Text>
      </View>
    </BaseModal>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 20,
  },
  qrWrapper: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  hint: {
    fontSize: 12,
    textAlign: "center",
  },
});
