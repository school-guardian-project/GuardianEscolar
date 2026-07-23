
import React, { useState } from "react";
import { ScrollView, View, Switch } from "react-native";
import { useTranslation } from "react-i18next";

import BackButton from "@components/buttons/BackButton";
import BottomTabBar from "@components/layout/BottomTabBar";
import InfoCard from "@components/cards/InfoCard";
import InfoRow from "@components/cards/InfoRow";
import { useTheme } from "@core/services/ThemeService";
import styles from "@core/styles/profileScreen.style";

export default function Security() {
    const { theme } = useTheme();
    const { t } = useTranslation();
    const [enabled, setEnabled] = useState(false);

    return (
        <View style={[styles.container, { backgroundColor: theme.bgColor }]}>
            <View style={styles.header}>
                <BackButton label={t("inputs.security")} />
            </View>

            <ScrollView
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
            >

                <InfoCard>
                    <InfoRow
                        icon="notifications-outline"
                        title={t("inputs.notifications")}
                        value={
                            enabled
                                ? t("security.notificationsOn")
                                : t("security.notificationsOff")
                        }
                        last
                    rightComponent={
                        <Switch
                            value={enabled}
                            onValueChange={setEnabled}
                            trackColor={{
                                false: theme.inputBorder,
                                true: theme.accentColor,
                            }}
                            thumbColor="#FFFFFF"
                        />
                    }
                    />
                </InfoCard>
                <InfoCard>
                    <InfoRow
                        icon="lock-closed-outline"
                        title={t("inputs.password")}
                        value={t("security.changePassword")}
                        editable
                        last
                    />
                </InfoCard>

            </ScrollView>

            <BottomTabBar />
        </View>
    );
}
