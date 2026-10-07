import React, { useEffect, useState } from "react";
import { View, ScrollView } from "react-native";
import { useTranslation } from "react-i18next";
import { useTheme } from "@core/services/ThemeService";

import BackButton from "@components/buttons/BackButton";
import BottomTabBar from "@components/layout/BottomTabBar";
import InfoCard from "@components/cards/InfoCard";
import InfoRow from "@components/cards/InfoRow";

import { useNavigation } from "@react-navigation/native";

import { getSession } from "@core/services/authService";
import { getUserApi } from "@core/services/userApi";
import { getProfile } from "@core/services/profileService";

import styles from "@core/styles/profileScreen.style";

const ROLE_PATHS = { 1: "admins", 2: "students", 3: "drivers", 4: "parents", 5: "admins" };

export default function Datas() {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const navigation = useNavigation();
  const [person, setPerson] = useState(null);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const session = await getSession();

        // Perfil desde ms-iam (trae personId y roleId aunque la sesión local esté incompleta)
        const profileData = await getProfile();
        const personId = profileData?.personId ?? session?.personId;
        const roleId = profileData?.roleId ?? session?.roleId;
        if (!personId) {
          return;
        }

        // Datos de la persona desde ms-user-management
        const path = ROLE_PATHS[roleId] ?? "students";
        const data = await getUserApi(`/${path}/${personId}`);
        if (alive) {
          setPerson(data);
          setProfile(profileData);
        }
      } catch (error) {
        console.warn("No se pudieron cargar los datos del usuario:", error?.message);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const fullName = person
    ? `${person.name ?? ""} ${person.lastName ?? ""}`.trim()
    : "";

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.bgColor },
      ]}
    >
      {/* Encabezado */}
      <View style={styles.header}>
        <BackButton label={t("inputs.data")} />
      </View>

      {/* Contenido */}
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <InfoCard>
          <InfoRow
            icon="person-outline"
            title={t("inputs.name")}
            value={fullName}
          />

          <InfoRow
            icon="call-outline"
            title={t("inputs.phone")}
            value={person?.phone != null ? String(person.phone) : ""}
            editable
            editOnPress={() => navigation.navigate("UpdatePhone")}
          />

          <InfoRow
            icon="mail-outline"
            title={t("inputs.email")}
            value={person?.email ?? profile?.email ?? ""}
            editable
            editOnPress={() => navigation.navigate("UpdateEmail")}
          />

          <InfoRow
            icon="lock-closed-outline"
            title={t("inputs.password")}
            value=""
            hidden
            last
          />
        </InfoCard>

        <InfoCard>
          <InfoRow
            icon="location-outline"
            title={t("inputs.address")}
            value={person?.residenceAddress ?? ""}
            arrow
          />

          <InfoRow
            icon="business-outline"
            title={t("inputs.city")}
            value={profile?.roleName ?? ""}
            arrow
            last
          />
        </InfoCard>

        <InfoCard>
          <InfoRow
            icon="school-outline"
            title={t("inputs.school")}
            value={profile?.campusId ?? ""}
            subtitle=""
            arrow
            last
          />
        </InfoCard>
      </ScrollView>

      <BottomTabBar />
    </View>
  );
}
