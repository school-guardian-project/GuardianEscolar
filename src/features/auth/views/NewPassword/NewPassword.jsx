import React, { useState } from "react";
import {
  View,
  ScrollView,
  Text,
  TextInput,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";

import { useTheme } from "@core/services/ThemeService";
import BackButton from "@components/buttons/BackButton";
import PrimaryButton from "@components/buttons/PrimaryButton";

import styles from "./NewPassword.style";

export default function NewPassword() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const navigation = useNavigation();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.bgColor }}
      contentContainerStyle={styles.container}
    >
      <View style={{ marginBottom: 25, marginLeft: -15, marginTop: -10 }}>
        <BackButton />
      </View>

      <Text
        style={[
          styles.title,
          { color: theme.titleColor },
        ]}
      >
        {t("newPassword.title")}
      </Text>

      <Text
        style={[
          styles.description,
          { color: theme.textSecondary },
        ]}
      >
        {t("newPassword.description")}
      </Text>

      <Text
        style={[
          styles.label,
          { color: theme.titleColor },
        ]}
      >
        {t("newPassword.newPasswordPlaceholder")}
      </Text>

      <TextInput
        value={password}
        onChangeText={setPassword}
        
        placeholderTextColor={theme.cardColorInput}
        secureTextEntry
        style={[
          styles.input,
          {
            backgroundColor: theme.cardSecondaryBg,
            borderColor: theme.borderColor,
            color: theme.textColor,
          },
        ]}
      />

      <Text
        style={[
          styles.label,
          { color: theme.titleColor },
        ]}
      >
        {t("newPassword.confirmPasswordPlaceholder")}
      </Text>

      <TextInput
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        placeholderTextColor={theme.cardColorInput}
        secureTextEntry
        style={[
          styles.input,
          {
            backgroundColor: theme.cardSecondaryBg,
            borderColor: theme.borderColor,
            color: theme.textColor,
          },
        ]}
      />

      <View style={styles.buttonWrap}>
        <PrimaryButton
          text={t("button.restore")}
          onPress={() => navigation.navigate("Login")}
        />
      </View>
    </ScrollView>
  );
}