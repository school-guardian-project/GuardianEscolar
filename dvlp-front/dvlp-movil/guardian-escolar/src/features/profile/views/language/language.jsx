import React from "react";
import { View, ScrollView } from "react-native";
import { useTranslation } from "react-i18next";
import { useTheme } from "@core/services/ThemeService";

import BackButton from "@components/buttons/BackButton";
import BottomTabBar from "@components/layout/BottomTabBar";
import SettingsItem from "@components/inputs/SettingsItem";

import { changeLanguage } from "@core/i18n/i18n";

import styles from "@core/styles/profileScreen.style";

export default function Language() {
    const { theme } = useTheme();
    const { t, i18n } = useTranslation();

    const renderRadio = (language) => (
        <View
            style={[
                styles.radio,
                {
                    borderColor:
                        i18n.language === language
                            ? theme.primaryColor
                            : theme.borderColor,
                },
            ]}
        >
            {i18n.language === language && (
                <View
                    style={[
                        styles.radioSelected,
                        {
                            backgroundColor: theme.primaryColor,
                        },
                    ]}
                />
            )}
        </View>
    );

    return (
        <View
            style={[
                styles.container,
                { backgroundColor: theme.bgColor },
            ]}
        >
            {/* Encabezado */}
            <View style={styles.header}>
                <BackButton label={t("inputs.appearance")}
                    backTo="Profile" />
            </View>


            {/* Contenido */}
            <ScrollView
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
            >

                <View>

                    <SettingsItem
                        title="Español"
                        onPress={() => changeLanguage("es")}
                        rightContent={renderRadio("es")}
                    />

                    <SettingsItem
                        title="English"
                        onPress={() => changeLanguage("en")}
                        rightContent={renderRadio("en")}
                    />

                    <SettingsItem
                        title="Français"
                        onPress={() => changeLanguage("fr")}
                        rightContent={renderRadio("fr")}
                    />

                    <SettingsItem
                        title="Português"
                        onPress={() => changeLanguage("pt")}
                        rightContent={renderRadio("pt")}
                    />

                </View>

            </ScrollView>

            <BottomTabBar />

        </View>
    );
}