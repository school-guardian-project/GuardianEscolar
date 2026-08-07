import React from "react";
import { View, Text, ScrollView } from "react-native";
import { useTranslation } from "react-i18next";
import { useTheme } from "@core/services/ThemeService";

import BackButton from "@components/buttons/BackButton";
import BottomTabBar from "@components/layout/BottomTabBar";

import { useNavigation } from "@react-navigation/native";
import styles from "@core/styles/profileScreen.style";

export default function Appearance() {
    const { theme } = useTheme();
    const { t } = useTranslation();
    const navigation = useNavigation();
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

            </ScrollView>

            <BottomTabBar />
        </View>
    );
}


