import React, { useState } from "react";
import {
  View,
  ScrollView,
  Text,
  TextInput,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import { useTranslation } from "react-i18next";

import { useTheme } from "@core/services/ThemeService";
import PrimaryButton from "@components/buttons/PrimaryButton";
import BackButton from "@components/buttons/BackButton";

import styles from "./ForgotPassword.style";

type RootStackParamList = {
  Login: undefined;
  ForgotPassword: undefined;
  VerifyCode: undefined;
  HomeTabs: undefined;
};

export default function ForgotPassword() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const [email, setEmail] = useState("");

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.bgColor }}
      contentContainerStyle={styles.container}
    >
      {/* Botón volver */}
      <View style={{ marginBottom: 25, marginLeft: -15, marginTop: -10 }}>
        <BackButton />
      </View>

      <Text
        style={[
          styles.title,
          { color: theme.titleColor }
        ]}
      >
        {t("forgotPassword.title")}
      </Text>

      <Text
        style={[
          styles.description,
          { color: theme.textSecondary }
        ]}
      >
        {t("forgotPassword.description")}
      </Text>

      <Text
        style={[
          styles.label,
          { color: theme.titleColor }
        ]}
      >
        {t("inputs.title.email")}
      </Text>

      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder={t("forgotPassword.emailPlaceholder")}
        placeholderTextColor={theme.cardColorInput}
        keyboardType="email-address"
        autoCapitalize="none"
        style={[
          styles.input,
          {
            backgroundColor: theme.cardSecondaryBg,
            borderColor: theme.borderColor,
            color: theme.textColor,
          },
        ]}
      />

      <PrimaryButton
        text={t("button.sendCode")}
        onPress={() => navigation.navigate("VerifyCode")}
      />
    </ScrollView>
  );
}