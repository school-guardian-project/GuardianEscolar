import React from "react";
import { View, ScrollView } from "react-native";
import { useTranslation } from "react-i18next";
import { useTheme } from "@core/services/ThemeService";

import BackButton from "@components/buttons/BackButton";
import BottomTabBar from "@components/layout/BottomTabBar";
import InfoCard from "@components/cards/InfoCard";
import InfoRow from "@components/cards/InfoRow";

import { useNavigation } from "@react-navigation/native";

import styles from "@core/styles/profileScreen.style";

export default function Datas() {
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
        <BackButton label={t("inputs.data")} />
      </View>

      {/* Contenido */}
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <InfoCard>
          <InfoRow
            icon="call-outline"
            title={t("inputs.phone")}
            value=""
            editable
            editOnPress={() => navigation.navigate("UpdatePhone")}
          />

          <InfoRow
            icon="mail-outline"
            title={t("inputs.email")}
            value=""
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
            value=""
            arrow
          />

          <InfoRow
            icon="business-outline"
            title={t("inputs.city")}
            value=""
            arrow
            last
          />
        </InfoCard>

        <InfoCard>
          <InfoRow
            icon="school-outline"
            title={t("inputs.school")}
            value=""
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
