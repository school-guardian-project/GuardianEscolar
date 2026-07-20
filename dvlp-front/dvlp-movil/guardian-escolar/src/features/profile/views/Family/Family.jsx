import React from "react";
import { View, ScrollView, Text } from "react-native";
import { useTranslation } from "react-i18next";
import { useTheme } from "@core/services/ThemeService";

import BackButton from "@components/buttons/BackButton";
import BottomTabBar from "@components/layout/BottomTabBar";
import InfoCard from "@components/cards/InfoCard";
import InfoRow from "@components/cards/InfoRow";
import styles from "@core/styles/profileScreen.style";

export default function Family() {
    const { theme } = useTheme();
    const { t } = useTranslation();

    return (
        <View
            style={[
                styles.container,
                { backgroundColor: theme.bgColor },
            ]}
        >
            {/* Encabezado */}
            <View style={styles.header}>
                <BackButton label={t("inputs.family")} />
            </View>

            <ScrollView
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
            >
                <View style={[styles.sectionHeader, styles.sectionHeaderFirst]}>
                    <Text
                        style={[
                            styles.sectionTitle,
                            { color: theme.titleColor },
                        ]}
                    >
                        {t("Family.holder")}
                    </Text>
                </View>

                <InfoCard>
                    <InfoRow
                        icon="person-circle-outline"
                        title={t("inputs.name")}
                        value={t("inputs.rol")}
                    />
                </InfoCard>

                <View style={styles.sectionHeader}>
                    <Text
                        style={[
                            styles.sectionTitle,
                            { color: theme.titleColor },
                        ]}
                    >
                        {t("Family.members")}
                    </Text>
                </View>

                <InfoCard>
                    <InfoRow
                        icon="person-circle-outline"
                        title={t("inputs.name")}
                        value={t("inputs.rol")}
                    />
                </InfoCard>

                <InfoCard>
                    <InfoRow
                        icon="person-circle-outline"
                        title={t("inputs.name")}
                        value={t("inputs.rol")}
                    />
                </InfoCard>
            </ScrollView>
            <BottomTabBar />
        </View>
    );
}
