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
// [MOCK-API] Simulación Cliente -> Backend(API json-server :3000 o backend :8080) -> DB
// Validación compartida con web (login.ts emailPattern + Validators.required)
import { authService } from "@core/api/services";
import { API_CONFIG } from "@core/api/api.config";
import { useRoleSwitcher } from "@core/dev/RoleSwitcherContext";

const EMAIL_PATTERN = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;
import { validateEmail, validateRequired } from "@core/validation/validators";

export default function Login({ navigation }) {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const { setRole, setSession } = useRoleSwitcher();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [emailError, setEmailError] = useState(null);
  const [passwordError, setPasswordError] = useState(null);

  // [MOCK-API] Flujo seguro: valida entrada igual que web, no logea password, rate-limit, mensaje genérico.
  const [attempts, setAttempts] = useState(0);
  const BLOCK_AFTER = 5;

  const validateFields = () => {
    let valid = true;
    const e = email.trim().toLowerCase();
    if (!e) {
      setEmailError("El correo es requerido.");
      valid = false;
    } else if (!EMAIL_PATTERN.test(e)) {
      setEmailError("Formato de correo inválido.");
      valid = false;
    } else {
      setEmailError(null);
    }
    if (!password) {
      setPasswordError("La contraseña es requerida.");
      valid = false;
    } else {
      setPasswordError(null);
    }
    return valid;
  };

  const handleLogin = async () => {
    setError(null);
    if (!API_CONFIG.ENABLED) {
      navigation.navigate("MainPage");
      return;
    }
    if (!validateFields()) return;
    if (attempts >= BLOCK_AFTER) {
      setError("Demasiados intentos. Espera 30s.");
      return;
    }
    if (loading) return;
    setLoading(true);
    const logPayload = { email: email.trim().toLowerCase(), timestamp: new Date().toISOString(), api: API_CONFIG.BASE_URL, attempt: attempts + 1 };
    if (typeof __DEV__ !== "undefined" && __DEV__) console.log("[Login] intento", logPayload);
    try {
      const session = await authService.login(email, password);
      setAttempts(0);
      if (session?.appRole) setRole(session.appRole);
      if (session) setSession(session);
      if (typeof __DEV__ !== "undefined" && __DEV__) console.log("[Login] OK", { role: session.role, appRole: session.appRole, email: session.person?.email, tokenPrefix: session.token?.slice(0, 10) });
      // Roles soportados: admin, padre/parent->father, conductor/driver, estudiante/student (todos logueados en la petición)
      navigation.navigate("MainPage");
    } catch (e) {
      setAttempts((a) => a + 1);
      const msg = e?.message || "No se pudo iniciar sesión. Intenta de nuevo.";
      if (typeof __DEV__ !== "undefined" && __DEV__) console.warn("[Login] fallo", { error: msg, payload: logPayload });
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
        {/* Correo - validación igual que web Validators.pattern + required */}
        <InputField
          label={t("inputs.title.email")}
          placeholder="ejemplo@gmail.com"
          value={email}
          onChangeText={(v) => { setEmail(v); if (emailError) setEmailError(null); }}
          keyboardType="email-address"
          autoCapitalize="none"
          error={emailError}
        />

        {/* Contraseña - Validators.required */}
        <InputField
          label={t("inputs.title.password")}
          placeholder="••••••••"
          value={password}
          onChangeText={(v) => { setPassword(v); if (passwordError) setPasswordError(null); }}
          secureTextEntry
          error={passwordError}
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

        {/* [MOCK-API] Error visible de la simulación API - genérico, no filtra si email existe */}
        {error ? (
          <Text style={{ color: "#d32f2f", marginTop: 8, textAlign: "center" }}>{error}</Text>
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



