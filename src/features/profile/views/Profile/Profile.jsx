import React, { useEffect, useState } from "react";
import { View, Text, ScrollView } from "react-native";
import { Ionicons, MaterialIcons, FontAwesome5, Entypo } from "@expo/vector-icons";
import { useTheme } from "@core/services/ThemeService";
import { useTranslation } from "react-i18next";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import InfoCard from "@components/cards/InfoCard";
import InfoRow from "@components/cards/InfoRow";
import { getSession } from "@core/services/authService";
import { resolveRouteForRole } from "@core/services/visibleRouteService";
import SettingsItem from "@components/inputs/SettingsItem";
import BottomTabBar from "@components/layout/BottomTabBar";
import useSession from "@core/hooks/useSession";
import { roleConfig } from "@core/config/roles/roleConfig";

import styles from "./Profile.style";

export default function Profile() {
    const { theme } = useTheme();
    const { t } = useTranslation();
    const navigation = useNavigation();
    const { role } = useSession();
    const isFocused = useIsFocused();
    const [assignment, setAssignment] = useState(null);
    const [assignmentError, setAssignmentError] = useState(null);
    const [loadingAssignment, setLoadingAssignment] = useState(false);
    useEffect(() => {
        if (!isFocused || role !== "driver") return;
        let alive = true;
        setAssignment(null);
        setAssignmentError(null);
        setLoadingAssignment(true);
        async function loadAssignment() {
            try {
                const session = await getSession();
                const result = await resolveRouteForRole("driver", session);
                if (alive) setAssignment(result);
            } catch (error) {
                console.error("Error loading driver profile assignment:", error);
                if (alive) setAssignmentError(error?.status ? `HTTP ${error.status}` : error.message);
            } finally {
                if (alive) setLoadingAssignment(false);
            }
        }
        loadAssignment();
        return () => { alive = false; };
    }, [role, isFocused]);
    const bus = assignment?.route?.bus ?? assignment?.bus;
    // La tarjeta "Mi familia" se oculta al conductor (roleConfig.profile).
    const showFamily = roleConfig[role]?.profile?.showFamily ?? true;
    return (
        <View style={[styles.container, { backgroundColor: theme.bgColor }]}>
            <ScrollView
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
            >
                <Text style={[styles.title, { color: theme.titleColor }]}>{t("profile.title")}</Text>
                <Text style={[styles.subtitle, { color: theme.titleColor }]}>{t("profile.subtitle")}</Text>

                {role === "driver" && (
                    <InfoCard>
                        <InfoRow icon="bus-outline" title={t("profile.assignedBus")}
                            value={bus?.plate ?? (loadingAssignment ? t("profile.assignmentLoading") : "—")} />
                        <InfoRow icon="map-outline" title={t("cards.route")}
                            value={assignment?.route?.name ?? "—"} last />
                        {assignment?.note ? (
                            <Text style={{ color: theme.textColor, padding: 18 }}>{assignment.note}</Text>
                        ) : null}
                        {assignmentError ? (
                            <Text accessibilityRole="alert" style={{ color: theme.textColor, padding: 18 }}>
                                {t("profile.assignmentError")} {assignmentError}
                            </Text>
                        ) : null}
                    </InfoCard>
                )}

                <View style={styles.card}>
                    <SettingsItem
                        icon={<Ionicons name="person" size={22} color={theme.iconColor} />}
                        title={t("inputs.data")}
                        onPress={() => navigation.navigate("Datas")}

                    />

                </View>

                {showFamily && (
                    <View style={styles.card}>
                        <SettingsItem
                            icon={<FontAwesome5 name="users" size={20} color={theme.iconColor} />}
                            title={t("inputs.family")}
                            onPress={() => navigation.navigate("Family")}
                        />
                    </View>
                )}

                <View style={styles.card}>
                    <SettingsItem
                        icon={<MaterialIcons name="security" size={22} color={theme.iconColor} />}
                        title={t("inputs.security")}
                        onPress={() => navigation.navigate("Security")}
                    />
                </View>

                <View style={styles.card}>
                    <SettingsItem
                        icon={<MaterialIcons name="palette" size={22} color={theme.iconColor} />}
                        title={t("inputs.appearance")}
                        onPress={() => navigation.navigate("Appearance")}
                    />
                </View>

                <View style={styles.card}>
                    <SettingsItem
                        icon={<MaterialIcons name="language" size={22} color={theme.iconColor} />}
                        title={t("inputs.language")}
                        onPress={() => navigation.navigate("Language")}
                    />
                </View>


                <View style={styles.card}>
                    <SettingsItem
                        icon={<Ionicons name="lock-closed" size={22} color={theme.iconColor} />}
                        title={t("inputs.privacity")}
                        onPress={() => navigation.navigate("PrivacyPolicies")}
                    />
                </View>

                <View style={styles.card}>
                    <SettingsItem
                        icon={<Ionicons name="document-text" size={22} color={theme.iconColor} />}
                        title={t("inputs.terms")}
                        onPress={() => navigation.navigate("TermsConditions")}
                    />
                </View>

                <View style={styles.card}>
                    <SettingsItem
                        icon={<Ionicons name="information-circle" size={22} color={theme.iconColor} />}
                        title={t("inputs.aboutus")}
                        onPress={() => navigation.navigate("AboutUs")}
                    />
                </View>

                <View style={styles.card}>
                    <SettingsItem
                        icon={<Entypo name="log-out" size={24} color="red" />}
                        title={t("inputs.logout")}
                        onPress={() => navigation.navigate("Logout")}
                    />
                </View>
            </ScrollView>
            <BottomTabBar />
        </View>
    );
}
