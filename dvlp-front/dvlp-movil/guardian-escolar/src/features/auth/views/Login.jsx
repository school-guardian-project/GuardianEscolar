import React, { useState } from "react";
import {
  ScrollView,
  Text,
  StyleSheet,
} from "react-native";
import { useTranslation } from "react-i18next";
import { useTheme } from "@core/services/ThemeService";

import InputField from "@components/inputs/InputField";
import PrimaryButton from "@components/buttons/PrimaryButton";

export default function Login({ navigation }) {
  const { t } = useTranslation();
  const { theme } = useTheme();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <ScrollView
      style={{ backgroundColor: theme.bgColor }}
      contentContainerStyle={styles.container}
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
        {t("login")}
      </Text>

      {/* Correo */}
      <InputField
        label={t("email")}
        placeholder="ejemplo@gmail.com"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />

      {/* Contraseña */}
      <InputField
        label={t("password")}
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
        {t("forgotPassword")}
      </Text>

      {/* Botón */}
      <PrimaryButton
        text={t("button.enter")}
        /*onPress={() => navigation.navigate("Home")}*/
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 25,
  },

  icon: {
    fontSize: 70,
    textAlign: "center",
    marginBottom: 10,
  },

  title: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 50,
  },

  forgotPassword: {
    fontSize: 13,
    marginBottom: 30,
  },
});