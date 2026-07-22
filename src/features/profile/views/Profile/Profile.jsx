import React from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import { Ionicons, MaterialIcons, FontAwesome5, Entypo } from "@expo/vector-icons";
import { useTheme } from "@core/services/ThemeService";
import { useTranslation } from "react-i18next";
import { useNavigation } from "@react-navigation/native";
import SettingsItem from "@components/inputs/SettingsItem";
import BottomTabBar from "@components/layout/BottomTabBar";

import styles from "./Profile.style";

export default function Profile() {
    const { theme } = useTheme();
    const { t } =  useTranslation();
    const navigation = useNavigation();
    return (
        <View style={[styles.container, { backgroundColor: theme.bgColor }]}>
            <ScrollView
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
            >
                <Text style={[styles.title, { color: theme.titleColor }]}>{t("profile.title")}</Text>
                <Text style={styles.subtitle}>{t("profile.subtitle")}</Text>

                <View style={styles.card}>
                    <SettingsItem
                        icon={<Ionicons name="person" size={22} color={theme.iconColor} />}
                        title={t("inputs.data")}
                        onPress={() => navigation.navigate("Datas")}
                        
                    />
                  
                </View>

                <View style={styles.card}>
                    <SettingsItem
                        icon={<FontAwesome5 name="users" size={20} color={theme.iconColor} />}
                        title={t("inputs.family")}
                        onPress={() => navigation.navigate("Family")}
                    />
                </View>

                <View style={styles.card}>
                    <SettingsItem
                        icon={<MaterialIcons name="security" size={22} color={theme.iconColor} />}
                        title={t("inputs.security")}
                        onPress={() => navigation.navigate("Security")}
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
