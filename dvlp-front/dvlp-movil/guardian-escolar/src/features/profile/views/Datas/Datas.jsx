import React from "react";
import { View, ScrollView } from "react-native";
import { useTranslation } from "react-i18next";
import { useTheme } from "@core/services/ThemeService";

import BackButton from "@components/buttons/BackButton";
import BottomTabBar from "@components/layout/BottomTabBar";
import InfoCard from "@components/cards/InfoCard";
import InfoRow from "@components/cards/InfoRow";

import styles from "./Datas.style";

export default function Datas() {
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
            value="+57 *** *** ****"
            editable
          />

          <InfoRow
            icon="mail-outline"
            title={t("inputs.email")}
            value="correoejemplo@gmail.com"
            editable
          />

          <InfoRow
            icon="lock-closed-outline"
            title={t("inputs.password")}
            value="••••••••••••"
            hidden
            last
          />
        </InfoCard>

        <InfoCard>
          <InfoRow
            icon="location-outline"
            title={t("inputs.address")}
            value="Calle 2 #1W-102"
            arrow
          />

          <InfoRow
            icon="business-outline"
            title={t("inputs.city")}
            value="Neiva"
            arrow
            last
          />
        </InfoCard>

        <InfoCard>
          <InfoRow
            icon="school-outline"
            title={t("inputs.school")}
            value="Nombre - Neiva"
            subtitle="Dirección"
            arrow
            last
          />
        </InfoCard>
      </ScrollView>

      <BottomTabBar />
    </View>
  );
}
