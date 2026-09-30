import React, { useEffect, useState } from "react";
import { View, ScrollView, Text } from "react-native";
import { useTranslation } from "react-i18next";
import { useTheme } from "@core/services/ThemeService";

import BackButton from "@components/buttons/BackButton";
import BottomTabBar from "@components/layout/BottomTabBar";
import InfoCard from "@components/cards/InfoCard";
import InfoRow from "@components/cards/InfoRow";

import { getSession } from "@core/services/authService";
import { getUserApi } from "@core/services/userApi";

import styles from "@core/styles/profileScreen.style";

async function personName(path) {
  try {
    const person = await getUserApi(path);
    return `${person.name ?? ""} ${person.lastName ?? ""}`.trim();
  } catch {
    return "";
  }
}

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
                const myIds = [session?.personId, session?.profileId].filter(Boolean);
                if (myIds.length === 0) {
                    return;
                }

                // ponytail: recorre las familias hasta encontrar la del usuario;
                // pedir ?personId= al backend cuando la lista crezca.
                const list = await getUserApi("/families");
                let mine = null;
                for (const item of list) {
                    const detail = await getUserApi(`/families/${item.id}`);
                    const ids = [detail.parentProfileId, ...(detail.children ?? [])];
                    if (ids.some((id) => myIds.includes(id))) {
                        mine = detail;
                        break;
                    }
                }
                if (!mine || !alive) {
                    return;
                }

                const holderName = mine.parentProfileId
                    ? await personName(`parents/${mine.parentProfileId}`)
                    : "";
                const memberNames = await Promise.all(
                    (mine.children ?? []).map((id) => personName(`students/${id}`))
                );

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
