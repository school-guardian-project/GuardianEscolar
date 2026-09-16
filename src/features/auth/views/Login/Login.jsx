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
import { validateEmail, validateRequired } from "@core/validation/validators";

export default function Login({ navigation }) {
  const { t } = useTranslation();
  const { theme } = useTheme();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

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

  const handleSubmit = () => {
    const nextEmailError = validateEmail(email);
    const nextPasswordError = validateRequired(
      password,
      "Ingresa tu contraseña"
    );

    setEmailError(nextEmailError);
    setPasswordError(nextPasswordError);

    if (nextEmailError || nextPasswordError) {
      return;
    }

    navigation.navigate("MainPage");
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

        {/* Botón */}
        <View style={styles.buttonWrap}>
          <PrimaryButton
            text={t("button.enter")}
            onPress={handleSubmit}
          />
        </View>
      </View>
    </ScrollView>
  );
}



