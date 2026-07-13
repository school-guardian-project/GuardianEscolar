import React from "react";
import { View, Text } from "react-native";
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
        <View
            style={[
                styles.container,
                { backgroundColor: theme.bgColor },
            ]}
        >
            {/* Botón volver */}
            <View style={{ marginBottom: 25, marginLeft: -15, marginTop: -10 }}>
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

            <CodeInput />

            <Text
                style={[
                    styles.info,
                    { color: theme.titleColor },
                ]}
            >
                {t("verifyCode.transferCode")}
            </Text>

            <PrimaryButton
                text={t("button.verifyCode")}
                onPress={() => navigation.navigate("NewPassword")}
            />
        </View>
    );
}