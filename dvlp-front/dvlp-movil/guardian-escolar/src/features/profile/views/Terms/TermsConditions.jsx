import React from "react";
import { View, Text, ScrollView } from "react-native";
import { useTranslation } from "react-i18next";
import { useTheme } from "@core/services/ThemeService";

import ExpandSection from "@components/cards/ExpandedSection";
import BackButton from "@components/buttons/BackButton";
import BottomTabBar from "@components/layout/BottomTabBar";
import InfoCard from "@components/cards/InfoCard";


import styles from "@core/styles/profileScreen.style";

export default function TermsConditions() {
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
        <BackButton label={t("inputs.terms")} />
      </View>


      {/* Contenido */}
      <ScrollView
  contentContainerStyle={styles.content}
  showsVerticalScrollIndicator={false}
>

  <InfoCard>
    <ExpandSection
      title={t("inputs.titleObject")}
    >
      <Text style={styles.description}>
        {t("terms.descriObject")}
      </Text>
    </ExpandSection>

    <ExpandSection
      title={t("inputs.titleAcceptance")}

    >
      <Text style={styles.description}>
        {t("terms.descriAcceptance")}
      </Text>
    </ExpandSection>

    <ExpandSection
      title={t("inputs.titleRoles")}
    >
      <Text style={styles.description}>
        {t("terms.descriRoles")}
      </Text>
    </ExpandSection>

    <ExpandSection
      title={t("inputs.titleProperUse")}
    >
      <Text style={styles.description}>
        {t("terms.descriProperUse")}
      </Text>
    </ExpandSection>

    <ExpandSection
      title={t("inputs.titleLocation")}
    >
      <Text style={styles.description}>
        {t("terms.descriLocation")}
      </Text>
    </ExpandSection>

    <ExpandSection
      title={t("inputs.titleQr")}
    >
      <Text style={styles.description}>
        {t("terms.descriQr")}
      </Text>
    </ExpandSection>

    <ExpandSection
      title={t("inputs.titleLiability")}
    >
      <Text style={styles.description}>
        {t("terms.descriLiability")}
      </Text>
    </ExpandSection>

    <ExpandSection
      title={t("inputs.titleAccounts")}
    >
      <Text style={styles.description}>
        {t("terms.descriAccounts")}
      </Text>
    </ExpandSection>

    <ExpandSection
      title={t("inputs.titleContact")}
    >
      <Text style={styles.description}>
        {t("terms.descriContact")}
      </Text>
    </ExpandSection>
  </InfoCard>

      </ScrollView>

      {/* Navegación inferior */}
      <BottomTabBar />
    </View>
  );
}
