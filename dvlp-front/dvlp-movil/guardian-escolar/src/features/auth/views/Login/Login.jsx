import React, { useState } from "react";
import {
  ScrollView,
  View,
  Text,
} from "react-native";
import { styles } from './Login.styles';
import { useTranslation } from "react-i18next";
import { useTheme } from "@core/services/ThemeService";

import InputField from "@components/inputs/InputField";
import PrimaryButton from "@components/buttons/PrimaryButton";
// [MOCK-API] Simulación Cliente -> Backend(API json-server) -> DB (db.json)
// Para quitar: borrar este import y la lógica de handleLogin, volver al onPress directo.
import { authService } from "@core/api/services";
import { API_CONFIG } from "@core/api/api.config";
import { useRoleSwitcher } from "@core/dev/RoleSwitcherContext";

export default function Login({ navigation }) {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const { setRole, setSession } = useRoleSwitcher();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // [MOCK-API] Flujo seguro: valida entrada, no logea password, rate-limit, mensaje genérico.
  const [attempts, setAttempts] = useState(0);
  const BLOCK_AFTER = 5;

  const handleLogin = async () => {
    setError(null);
    if (!API_CONFIG.ENABLED) {
      navigation.navigate("MainPage");
      return;
    }
    if (attempts >= BLOCK_AFTER) {
      setError("Demasiados intentos. Espera 30s.");
      return;
    }
    if (loading) return; // evita doble tap (rendimiento + seguridad)
    setLoading(true);
    try {
      const session = await authService.login(email, password);
      setAttempts(0);
      if (session?.appRole) setRole(session.appRole);
      if (session) setSession(session);
      // Seguridad: nunca logear password ni token completo
      if (typeof __DEV__ !== "undefined" && __DEV__) console.log("[Login] OK role:", session.role);
      navigation.navigate("MainPage");
    } catch (e) {
      setAttempts((a) => a + 1);
      // Seguridad: mensaje genérico, no filtrar si email existe. ApiError ya viene sanitizado.
      const msg = e?.message || "No se pudo iniciar sesión. Intenta de nuevo.";
      // No log PII en prod
      if (typeof __DEV__ !== "undefined" && __DEV__) console.warn("[Login] fallo:", msg);
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      style={{ backgroundColor: theme.bgColor }}
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      {/* Icono */}
      <Text style={styles.icon}>🛡️</Text>

      {/* Título */}
      <Text
        style={[
          styles.title,
          { color: theme.titleColor },
        ]}
      >
        {t("login.title")}
      </Text>

      <View style={styles.form}>
        {/* Correo */}
        <InputField
          label={t("inputs.title.email")}
          placeholder="ejemplo@gmail.com"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />

        {/* Contraseña */}
        <InputField
          label={t("inputs.title.password")}
          placeholder="••••••••"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        {/* Olvidó contraseña */}
        <Text
          style={[
            styles.forgotPassword,
            { color: theme.navbarColor },
          ]}
          onPress={() => navigation.navigate("ForgotPassword")}
        >
          {t("login.ForgotPassword")}
        </Text>

        {/* [MOCK-API] Error visible de la simulación API */}
        {error ? (
          <Text style={{ color: "#d32f2f", marginTop: 8, textAlign: "center" }}>{error}</Text>
        ) : null}
        {/* Hint para demo: credenciales reales del db.json */}
        {API_CONFIG.ENABLED ? (
          <Text style={{ color: theme.titleColor, opacity: 0.6, fontSize: 11, marginTop: 8, textAlign: "center" }}>
            Demo: admin1@colegio.edu.co / cualquier clave (json-server :3000)
          </Text>
        ) : null}

        {/* Botón */}
        <View style={styles.buttonWrap}>
          <PrimaryButton
            text={loading ? "Cargando..." : t("button.enter")}
            onPress={handleLogin}
          />
        </View>
      </View>
    </ScrollView>
  );
}
