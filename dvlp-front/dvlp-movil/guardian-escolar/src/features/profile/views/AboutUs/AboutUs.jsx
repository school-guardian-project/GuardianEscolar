import React from "react";
import { View, Text, ScrollView } from "react-native";
import { useTranslation } from "react-i18next";
import { useTheme } from "@core/services/ThemeService";

import ExpandSection from "@components/cards/ExpandedSection";
import BackButton from "@components/buttons/BackButton";
import BottomTabBar from "@components/layout/BottomTabBar";
import InfoCard from "@components/cards/InfoCard";
import PrimaryButton from "@components/buttons/PrimaryButton";
import { useNavigation } from "@react-navigation/native";

import styles from "@core/styles/profileScreen.style";

export default function Profile() {
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
                <BackButton label={t("inputs.aboutus")} />
            </View>


            {/* Contenido */}
            <ScrollView
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
            >

                <InfoCard>
                    <ExpandSection
                        title={t("inputs.titleAbout")}
                    >
                        <Text style={styles.description}>
                            {t("aboutus.descripAbout")}
                        </Text>
                    </ExpandSection>

                    <ExpandSection
                        title={t("inputs.titleMission")}

                    >
                        <Text style={styles.description}>
                            {t("aboutus.descripMission")}
                        </Text>
                    </ExpandSection>

                    <ExpandSection
                        title={t("inputs.titleVision")}
                    >
                        <Text style={styles.description}>
                            {t("aboutus.descripVision")}
                        </Text>
                    </ExpandSection>

                    <ExpandSection
                        title={t("inputs.titleTeam")}
                    >
                        <Text style={styles.description}>
                            {t("aboutus.descripTeam")}
                        </Text>
                    </ExpandSection>

                    <ExpandSection
                        title={t("inputs.titleValues")}
                    >
                        <Text style={styles.description}>
                            {t("aboutus.descripValues")}
                        </Text>
                    </ExpandSection>
                </InfoCard>
                <View style={styles.buttonsContainer}>
                    <View style={styles.button}>
                        <PrimaryButton
                            text={t("button.suport")}
                            onPress={() => navigation.navigate("Support")}
                        />
                    </View>

                    <View style={styles.button}>
                        <PrimaryButton
                            text={t("button.rateUs")}
                            onPress={() => navigation.navigate("Rating")}
                        />
                    </View>
                </View>
            </ScrollView>

            <BottomTabBar />
        </View>
    );
}


