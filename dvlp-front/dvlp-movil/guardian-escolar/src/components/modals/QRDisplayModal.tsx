import React, { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import QRCode from "react-native-qrcode-svg";
import BaseModal from "@components/modals/BaseModal";
import { useTheme } from "@core/services/ThemeService";
import { generateCredential } from "@core/services/notificationApi";
import type { Credential } from "@core/types/notifications";

interface QRDisplayModalProps {
  visible: boolean;
  onClose: () => void;
}

type CredentialState =
  | { phase: "idle" }
  | { phase: "loading" }
  | { phase: "ready"; credential: Credential }
  | { phase: "error" };

export default function QRDisplayModal({
  visible,
  onClose,
}: QRDisplayModalProps) {
  const { theme } = useTheme();
  const [state, setState] = useState<CredentialState>({ phase: "idle" });

  useEffect(() => {
    // La credencial caduca: se pide una nueva cada vez que el modal se abre.
    // La identidad la resuelve el backend a partir del token de sesión.
    if (!visible) {
      setState({ phase: "idle" });
      return;
    }

    let cancelled = false;
    setState({ phase: "loading" });

    generateCredential()
      .then((credential) => {
        if (!cancelled) {
          setState({ phase: "ready", credential });
        }
      })
      .catch(() => {
        if (!cancelled) {
          setState({ phase: "error" });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [visible]);

  const renderBody = () => {
    if (state.phase === "loading") {
      return <ActivityIndicator color={theme.navbarColor} />;
    }

    if (state.phase === "ready") {
      return (
        <QRCode
          value={state.credential.qrToken}
          size={260}
          color="#000000"
          backgroundColor="#FFFFFF"
          ecl="M"
        />
      );
    }

    return (
      <Text style={[styles.placeholder, { color: theme.textSecondary }]}>
        {state.phase === "error"
          ? "No se pudo generar el código. Cierra e intenta de nuevo."
          : "Sin datos del estudiante."}
      </Text>
    );
  };

  return (
    <BaseModal visible={visible} onClose={onClose} animationType="slide">
      <View style={[styles.container, { backgroundColor: theme.cardBg }]}>
        <Text style={[styles.title, { color: theme.textColor }]}>
          Código QR del Estudiante
        </Text>

        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
          Presenta este código al conductor
        </Text>

        <View style={styles.qrWrapper}>{renderBody()}</View>

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
    minWidth: 292,
    minHeight: 292,
    alignItems: "center",
    justifyContent: "center",
  },
  placeholder: {
    fontSize: 13,
    textAlign: "center",
    paddingHorizontal: 16,
  },
  hint: {
    fontSize: 12,
    textAlign: "center",
  },
});
