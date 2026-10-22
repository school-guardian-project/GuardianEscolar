import React, { useEffect, useState } from "react";
import { View, ScrollView, Text } from "react-native";
import { useTranslation } from "react-i18next";
import { useTheme } from "@core/services/ThemeService";

import BackButton from "@components/buttons/BackButton";
import BottomTabBar from "@components/layout/BottomTabBar";
import InfoCard from "@components/cards/InfoCard";
import InfoRow from "@components/cards/InfoRow";

import { getSession } from "@core/services/authService";
import { findMyFamily, namesByProfileId } from "@core/services/familyService";

import styles from "@core/styles/profileScreen.style";

export default function Family() {
    const { theme } = useTheme();
    const { t } = useTranslation();
    const [family, setFamily] = useState(null);
    const [holder, setHolder] = useState("");
    const [members, setMembers] = useState([]);

    useEffect(() => {
        let alive = true;
        (async () => {
            try {
                const session = await getSession();
                const mine = await findMyFamily(session);
                if (!mine || !alive) {
                    return;
                }

                // La familia trae profileIds; los nombres salen de los listados,
                // que son los que traen el profileId de cada persona.
                const [parents, students] = await Promise.all([
                    namesByProfileId("/parents"),
                    namesByProfileId("/students"),
                ]);
                const holderName = parents.get(mine.parentProfileId) ?? "";
                const memberNames = (mine.children ?? []).map((id) => students.get(id) ?? "");

                if (!alive) {
                    return;
                }
                setFamily(mine);
                setHolder(holderName);
                setMembers(memberNames);
            } catch {
                // Backend no disponible o el usuario aún no tiene familia.
            }
        })();
        return () => {
            alive = false;
        };
    }, []);

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
                        {t("inputs.family")}
                    </Text>
                </View>

                <InfoCard>
                    <InfoRow
                        icon="home-outline"
                        title={t("inputs.family")}
                        value={family?.name ?? "—"}
                        subtitle={family?.description ?? ""}
                        last
                    />
                </InfoCard>

                <View style={styles.sectionHeader}>
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
                        value={holder || "—"}
                        last
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

                {(members.length > 0 ? members : [""]).map((name, index) => (
                    <InfoCard key={index}>
                        <InfoRow
                            icon="person-circle-outline"
                            title={t("inputs.name")}
                            value={name || "—"}
                            last
                        />
                    </InfoCard>
                ))}
            </ScrollView>
            <BottomTabBar />
        </View>
    );
}
