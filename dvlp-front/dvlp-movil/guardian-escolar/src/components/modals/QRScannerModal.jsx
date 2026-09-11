import React, { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet, Modal, Pressable, Animated } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import BaseModal from "./BaseModal";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@core/services/ThemeService";

/**
 * QRScannerModal - Modal para escanear códigos QR usando la cámara.
 *
 * Props:
 *   - visible: boolean → Controla si el modal está abierto
 *   - onClose: function → Cierra el modal
 *   - onScan: function → Devuelve el contenido del QR escaneado al padre
 *
 * Flujo:
 *   1. Al abrir, verifica si tiene permiso de cámara
 *   2. Si no tiene permiso, muestra pantalla para concederlo
 *   3. Si tiene permiso, abre la cámara con vista de escaneo
 *   4. Al detectar un QR, envía los datos y cierra el modal
 */
export default function QRScannerModal({ visible, onClose, onScan }) {
  const { theme } = useTheme();

  // Hook de expo-camera para gestionar permisos de cámara
  const [permission, requestPermission] = useCameraPermissions();

  // Estado para evitar que se escanee múltiples veces el mismo código
  const [scanned, setScanned] = useState(false);

  const scanLine = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      setScanned(false);
    }
  }, [visible]);

  // Cada vez que el modal se abre, resetea el estado de escaneo
  useEffect(() => {
    if (
      visible &&
      permission &&
      !permission.granted &&
      permission.canAskAgain
    ) {
      requestPermission();
    }
  }, [visible, permission]);

  useEffect(() => {
    if (!visible) return;
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(scanLine, {
          toValue: 1,
          duration: 2200,
          useNativeDriver: true,
        }),
        Animated.timing(scanLine, {
          toValue: 0,
          duration: 2200,
          useNativeDriver: true,
        }),
      ]),
    );
    anim.start();
    return () => anim.stop();
  }, [visible]);

  // Handler que se ejecuta cuando la cámara detecta un código QR
  const handleBarCodeScanned = ({ data }) => {
    if (scanned) return; // Evita doble escaneo
    setScanned(true); // Marca como escaneado
    onScan(data); // Envía los datos del QR al componente padre
    onClose(); // Cierra el modal
  };

  // Si el permiso NO está concedido, muestra solicitud de permiso
  if (permission && !permission.granted && !permission.canAskAgain) {
    return (
      <Modal visible={visible} onRequestClose={onClose} animationType="slide">
        <View
          style={[
            styles.fullScreen,
            styles.blocked,
            { backgroundColor: theme.bgColor },
          ]}
        >
          <Ionicons
            name="camera-outline"
            size={56}
            color={theme.textSecondary}
          />
          <Text style={[styles.blockedTitle, { color: theme.textColor }]}>
            Permiso de cámara bloqueado
          </Text>
          <Text style={[styles.blockedText, { color: theme.textSecondary }]}>
            Activá el acceso a la cámara en los ajustes de tu teléfono para
            escanear códigos QR.
          </Text>
          <Pressable style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Cancelar</Text>
          </Pressable>
        </View>
      </Modal>
    );
  }

  return (
    <Modal visible={visible} onRequestClose={onClose} animationType="slide">
      <View style={styles.fullScreen}>
        <CameraView
          style={StyleSheet.absoluteFill}
          barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
          onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        />
        <View style={styles.scanFrame}>
          <View style={[styles.corner, styles.cornerTL]}></View>
          <View style={[styles.corner, styles.cornerTR]}></View>
          <View style={[styles.corner, styles.cornerBL]}></View>
          <View style={[styles.corner, styles.cornerBR]}></View>

          <Animated.View
            style={[
              styles.scanLine,
              {
                transform: [
                  {
                    translateY: scanLine.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, 230],
                    }),
                  },
                ],
              },
            ]}
          />
        </View>

        <Text style={styles.hint}>
          {scanned ? "Codigo detectado..." : "Apunta la camara al codigo QR"}
        </Text>

        <Pressable style={styles.closeButton} onPress={onClose}>
          <Ionicons name="close" size={28} color="#FFFFFF" />
        </Pressable>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  fullScreen: {
    flex: 1,
    backgroundColor: "#000000",  // negro solo como respaldo (cámara cubre todo)
    justifyContent: "center",
    alignItems: "center",
  },
  scanFrame: {
    width: 240,
    height: 240,
  },
  corner: {
    position: "absolute",
    width: 44,
    height: 44,
    borderColor: "#00E676",
    borderWidth: 0,
  },
  cornerTL: { top: 0, left: 0, borderTopWidth: 4, borderLeftWidth: 4, borderTopLeftRadius: 8 },
  cornerTR: { top: 0, right: 0, borderTopWidth: 4, borderRightWidth: 4, borderTopRightRadius: 8 },
  cornerBL: { bottom: 0, left: 0, borderBottomWidth: 4, borderLeftWidth: 4, borderBottomLeftRadius: 8 },
  cornerBR: { bottom: 0, right: 0, borderBottomWidth: 4, borderRightWidth: 4, borderBottomRightRadius: 8 },
  scanLine: {
    position: "absolute",
    left: 8,
    right: 8,
    top: 4,
    height: 2,
    backgroundColor: "#00E676",
    borderRadius: 1,
  },
  hint: {
    position: "absolute",
    bottom: 80,
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "500",
  },
  closeButton: {
    position: "absolute",
    top: 60,
    right: 24,
    padding: 8,
  },
  blocked: {
    padding: 24,
    gap: 12,
  },
  blockedTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  blockedText: {
    fontSize: 14,
    textAlign: "center",
  },
});
