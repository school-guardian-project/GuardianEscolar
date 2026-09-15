import React, { useState, useEffect, useCallback } from "react";
import { View, ScrollView, Text, ActivityIndicator } from "react-native";
import { useTranslation } from "react-i18next";
import { useTheme } from "@core/services/ThemeService";
import { useFocusEffect } from "@react-navigation/native";

import BackButton from "@components/buttons/BackButton";
import BottomTabBar from "@components/layout/BottomTabBar";
import InfoCard from "@components/cards/InfoCard";
import InfoRow from "@components/cards/InfoRow";
import styles from "@core/styles/profileScreen.style";

import useSession from "@core/hooks/useSession";
import { API_CONFIG } from "@core/api/api.config";
import { apiClient } from "@core/api/api.client";
import { ENDPOINTS } from "@core/api/api.config";

export default function Family() {
    const { theme } = useTheme();
    const { t } = useTranslation();
    const { session } = useSession();

    const [loading, setLoading] = useState(true);
    const [holder, setHolder] = useState(null);
    const [members, setMembers] = useState([]);
    const [familyName, setFamilyName] = useState(null);

    const loadFamily = useCallback(async () => {
        if (!API_CONFIG.ENABLED) { setLoading(false); return; }
        setLoading(true);
        try {
            // Buscar perfil por email del usuario logueado
            const email = session?.person?.email;
            if (!email) { setLoading(false); return; }
            const persons = await apiClient.query(ENDPOINTS.persons, { Email: email });
            const person = persons[0];
            if (!person) { setLoading(false); return; }
            const profiles = await apiClient.query(ENDPOINTS.profiles, { PersonId: person.Id });
            const profileId = profiles[0]?.Id;
            if (!profileId) { setLoading(false); return; }
            console.log("[Family] Cargando familia para profile", profileId);

            const myMembership = await apiClient.query(ENDPOINTS.familyMembers, { ProfileId: profileId });
            const familyId = myMembership[0]?.FamilyId;
            if (!familyId) { setLoading(false); return; }

            const family = await apiClient.query(ENDPOINTS.families, { Id: familyId });
            if (family[0]) setFamilyName(family[0].Name);

            const allMembers = await apiClient.query(ENDPOINTS.familyMembers, { FamilyId: familyId });
            // Enriquecer cada miembro con Profile -> Person + Role
            const enriched = [];
            for (const fm of allMembers) {
                const profiles = await apiClient.query(ENDPOINTS.profiles, { Id: fm.ProfileId });
                const profile = profiles[0];
                if (!profile) continue;
                const persons = await apiClient.query(ENDPOINTS.persons, { Id: profile.PersonId });
                const person = persons[0];
                const roles = await apiClient.query(ENDPOINTS.roles, { ID: profile.RoleId });
                const roleName = roles[0]?.Name || fm.RelationshipType;
                enriched.push({ fm, person, roleName, profile });
            }
            // Holder = PARENT, Members = resto
            const holderMember = enriched.find(e => e.fm.RelationshipType === 'PARENT') || enriched[0];
            const otherMembers = enriched.filter(e => e !== holderMember);
            setHolder(holderMember || null);
            setMembers(otherMembers);
            console.log("[Family] OK", { familyId, holder: holderMember?.person?.Email, members: enriched.length });
        } catch (e) {
            console.warn("[Family] API fallo", e.message);
        } finally {
            setLoading(false);
        }
    }, [session]);

    useEffect(() => { loadFamily(); }, [loadFamily]);
    useFocusEffect(useCallback(() => { loadFamily(); }, [loadFamily]));

    return (
        <View style={[styles.container, { backgroundColor: theme.bgColor }]}>
            <View style={styles.header}>
                <BackButton label={t("inputs.family")} />
            </View>

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                {familyName ? (
                    <Text style={{ color: theme.titleColor, opacity: 0.6, fontSize: 12, textAlign: "center", marginBottom: 8 }}>{familyName}</Text>
                ) : null}
                {loading ? <ActivityIndicator style={{ marginTop: 20 }} /> : null}

                <View style={[styles.sectionHeader, styles.sectionHeaderFirst]}>
                    <Text style={[styles.sectionTitle, { color: theme.titleColor }]}>{t("Family.holder")}</Text>
                </View>
                <InfoCard>
                    {holder ? (
                        <InfoRow
                            icon="person-circle-outline"
                            title={`${holder.person?.Name || ''} ${holder.person?.LastName || ''}`.trim() || holder.person?.Email}
                            value={holder.roleName}
                            subtitle={holder.person?.Email}
                        />
                    ) : (
                        <InfoRow icon="person-circle-outline" title={t("inputs.name")} value={loading ? "..." : "Sin datos"} />
                    )}
                </InfoCard>

                <View style={styles.sectionHeader}>
                    <Text style={[styles.sectionTitle, { color: theme.titleColor }]}>{t("Family.members")}</Text>
                </View>
                {members.length ? members.map((m) => (
                    <InfoCard key={m.fm.Id}>
                        <InfoRow
                            icon="person-circle-outline"
                            title={`${m.person?.Name || ''} ${m.person?.LastName || ''}`.trim() || m.person?.Email}
                            value={m.roleName}
                            subtitle={m.person?.Email}
                        />
                    </InfoCard>
                )) : (
                    <InfoCard>
                        <InfoRow icon="person-circle-outline" title={t("inputs.name")} value={loading ? "..." : "Sin miembros"} />
                    </InfoCard>
                )}
            </ScrollView>
            <BottomTabBar />
        </View>
    );
}
