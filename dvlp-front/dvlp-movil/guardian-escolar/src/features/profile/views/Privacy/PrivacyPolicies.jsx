import React from "react";
import { View, Text, ScrollView } from "react-native";
import { useTranslation } from "react-i18next";
import { useTheme } from "@core/services/ThemeService";

import ExpandSection from "@components/cards/ExpandedSection";
import BackButton from "@components/buttons/BackButton";
import BottomTabBar from "@components/layout/BottomTabBar";
import InfoCard from "@components/cards/InfoCard";


import styles from "@core/styles/profileScreen.style";

export default function PrivacyPolicies() {
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
        <BackButton label={t("inputs.privacity")} />
      </View>


      {/* Contenido */}
      <ScrollView
  contentContainerStyle={styles.content}
  showsVerticalScrollIndicator={false}
>

  <InfoCard>
    <ExpandSection
      title={t("inputs.titlePermission")}
    >
      <Text style={styles.description}>
        {t("privacy.descriPermission")}
      </Text>
    </ExpandSection>

    <ExpandSection
      title={t("inputs.titleDatas")}

    >
      <Text style={styles.description}>
        {t("privacy.descripDatas")}
      </Text>
    </ExpandSection>

    <ExpandSection
      title={t("inputs.titleProtection")}
    >
      <Text style={styles.description}>
        {t("privacy.descriProtection")}
      </Text>
    </ExpandSection>

    <ExpandSection
      title={t("inputs.titleAutentication")}
    >
      <Text style={styles.description}>
        {t("privacy.descripAutentication")}
      </Text>
    </ExpandSection>

    <ExpandSection
      title={t("inputs.titleAccess")}
    >
      <Text style={styles.description}>
        {t("privacy.descripAccess")}
      </Text>
    </ExpandSection>

    <ExpandSection
      title={t("inputs.titleRegister")}
   
    >
      <Text style={styles.description}>
       {t("privacy.descripRegister")}
      </Text>
    </ExpandSection>

    <ExpandSection
      title={t("inputs.titleElimination")}
      
    >
      <Text style={styles.description}>
        {t("privacy.descripElimination")}
      </Text>
    </ExpandSection>

    <ExpandSection
      title={t("inputs.titleConnection")}
      
    >
      <Text style={styles.description}>
        {t("privacy.descripConnection")}
      </Text>
    </ExpandSection>

    <ExpandSection
      title={t("inputs.titleLaws")}
      
    >
      <Text style={styles.description}>
        {t("privacy.descripLaws")}
      </Text>
    </ExpandSection>
  </InfoCard>



</ScrollView>

      <BottomTabBar />
    </View>
  );
}