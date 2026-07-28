import React from "react";
import { ScrollView, View, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";

import { useTheme } from "@core/services/ThemeService";

import BackButton from "@components/buttons/BackButton";
import CodeInput from "@components/inputs/CodeInput";
import PrimaryButton from "@components/buttons/PrimaryButton";

import styles from "./VerifyCode.style";

export default function VerifyCode() {
    const { t } = useTranslation();
    const { theme } = useTheme();
    const navigation = useNavigation();

    return (
        <ScrollView
            style={[
                { backgroundColor: theme.bgColor },
            ]}
            contentContainerStyle={styles.container}
            keyboardShouldPersistTaps="handled"
        >
            {/* Botón volver */}
            <View style={styles.backButtonWrap}>
                <BackButton />
            </View>

            <Text
                style={[
                    styles.title,
                    { color: theme.titleColor },
                ]}
            >
                {t("verifyCode.title")}
            </Text>

            <Text
                style={[
                    styles.description,
                    { color: theme.textSecondary },
                ]}
            >
                {t("verifyCode.description")}
            </Text>

            <View style={styles.form}>
              <CodeInput />

              <Text
                  style={[
                      styles.info,
                      { color: theme.titleColor },
                  ]}
              >
                  {t("verifyCode.transferCode")}
              </Text>

              <View style={styles.buttonWrap}>
                <PrimaryButton
                    text={t("button.verifyCode")}
                    onPress={() => navigation.navigate("NewPassword")}
                />
              </View>
            </View>
        </ScrollView>
    );
}
