import React from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";
import { useTheme } from "@core/services/ThemeService";

import BaseModal from "@components/modals/BaseModal";

const TERMS_SECTIONS = [
  ["inputs.titleObject", "terms.descriObject"],
  ["inputs.titleAcceptance", "terms.descriAcceptance"],
  ["inputs.titleRoles", "terms.descriRoles"],
  ["inputs.titleProperUse", "terms.descriProperUse"],
  ["inputs.titleLocation", "terms.descriLocation"],
  ["inputs.titleQr", "terms.descriQr"],
  ["inputs.titleLiability", "terms.descriLiability"],
  ["inputs.titleAccounts", "terms.descriAccounts"],
  ["inputs.titleContact", "terms.descriContact"],
];

const PRIVACY_SECTIONS = [
  ["inputs.titleDatas", "privacy.descripDatas"],
  ["inputs.titleProtection", "privacy.descripProtection"],
  ["inputs.titleAccess", "privacy.descripAccess"],
  ["inputs.titleElimination", "privacy.descripElimination"],
  ["inputs.titleLaws", "privacy.descripLaws"],
];

/**
 * Modal informativo pre-login: muestra los documentos sin registrar nada,
 * porque aún no hay sesión a la cual atar la evidencia.
 */
export default function LegalInfoModal({ visible, onClose, doc }) {
  const { t } = useTranslation();
  const { theme } = useTheme();

  const title = doc === "privacy" ? t("inputs.privacity") : t("inputs.terms");
  const sections = doc === "privacy" ? PRIVACY_SECTIONS : TERMS_SECTIONS;

  return (
    <BaseModal visible={visible} onClose={onClose} animationType="slide">
      <Text style={[styles.title, { color: theme.titleColor }]}>{title}</Text>
      <ScrollView showsVerticalScrollIndicator={false}>
        {sections.map(([titleKey, bodyKey]) => (
          <View key={titleKey} style={styles.section}>
            <Text style={[styles.heading, { color: theme.titleColor }]}>
              {t(titleKey)}
            </Text>
            <Text style={styles.body}>{t(bodyKey)}</Text>
          </View>
        ))}
      </ScrollView>
    </BaseModal>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 12,
  },
  section: {
    marginBottom: 12,
  },
  heading: {
    fontSize: 15,
    fontWeight: "bold",
    marginBottom: 4,
  },
  body: {
    fontSize: 13,
    lineHeight: 19,
    color: "#444",
  },
});
