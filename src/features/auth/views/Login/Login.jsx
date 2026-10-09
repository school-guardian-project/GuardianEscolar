import React, { useState } from "react";

import {
  ScrollView,
  View,
  Text,
} from "react-native";

import { Asset } from "expo-asset";
import { SvgUri } from "react-native-svg";
import { styles } from "./Login.styles";
import { useTranslation } from "react-i18next";
import { useTheme } from "@core/services/ThemeService";

import InputField from "@components/inputs/InputField";
import PrimaryButton from "@components/buttons/PrimaryButton";
import { validateEmail, validateRequired } from "@core/validation/validators";
import { login } from "@core/services/authService";
import { registerForPushNotificationsAsync } from "@core/services/pushNotifications";
import useSession from "@core/hooks/useSession";

const logoUri = Asset.fromModule(
  require("../../../../../assets/logo-blue.svg")
).uri;

export default function Login({ navigation }) {
  const { t } = useTranslation();
  const { theme } = useTheme();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { applyAuthRole } = useSession();

  const handleEmailChange = (value) => {
    setEmail(value);

    if (emailError) {
      setEmailError("");
    }
  };

  const handlePasswordChange = (value) => {
    setPassword(value);

    if (passwordError) {
      setPasswordError("");
    }
  };

  const signIn = async () => {
    if (submitting) {
      return;
    }

    setSubmitting(true);
    setFormError("");

    try {
      await login(email, password);
      applyAuthRole();
      navigation.navigate("MainPage");
      registerForPushNotificationsAsync();
    } catch {
      setFormError(t("login.error"));
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = () => {
    const nextEmailError = validateEmail(email);
    const nextPasswordError = validateRequired(
      password,
      "Ingresa tu contraseña"
    );

    setEmailError(nextEmailError);
    setPasswordError(nextPasswordError);
    setFormError("");

    if (nextEmailError || nextPasswordError) {
      return;
    }

    signIn();
  };

  return (
    <ScrollView
      style={{ backgroundColor: theme.bgColor }}
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      {/* Logo oficial de Guardian Escolar */}
      <SvgUri
        uri={logoUri}
        width={92}
        height={113}
        style={styles.icon}
      />

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
          onChangeText={handleEmailChange}
          keyboardType="email-address"
          error={emailError}
        />

        {/* Contraseña */}
        <InputField
          label={t("inputs.title.password")}
          placeholder="••••••••"
          value={password}
          onChangeText={handlePasswordChange}
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

        {/* Error del formulario */}
        {formError ? (
          <Text style={styles.error}>
            {formError}
          </Text>
        ) : null}

        {/* Botón */}
        <View style={styles.buttonWrap}>
          <PrimaryButton
            text={t("button.enter")}
            onPress={handleSubmit}
            disabled={submitting}
          />
        </View>
      </View>
    </ScrollView>
  );
}
