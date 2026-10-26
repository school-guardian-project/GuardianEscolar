import React, { useState } from "react";
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, CheckBox } from "react-native";
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
 * Modal para aceptación de términos y autorización de datos de menores.
 * Incluye checkbox obligatorio conforme a Ley 1581 de 2012.
 */
export default function TermsAcceptanceModal({ visible, onClose, onAccept, minorsCount = 0 }) {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const [accepted, setAccepted] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);

  const handleAccept = () => {
    if (!accepted) return;
    onAccept?.();
    onClose?.();
  };

  return (
    <BaseModal visible={visible} onClose={onClose} animationType="slide">
      <View style={[styles.header, { borderBottomColor: theme.borderColor }]}>
        <Text style={[styles.title, { color: theme.titleColor }]}>{t("accept.title")}</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {/* Subtítulo explicativo */}
        <Text style={[styles.subtitle, { color: theme.textColor }]}>{t("accept.subtitle")}</Text>

        {/* Aviso legal Ley 1581 */}
        <View style={styles.noticeContainer}>
          <Text style={styles.noticeIcon}>⚖️</Text>
          <Text style={[styles.noticeText, { color: theme.textColor }]}>{t("accept.minorDataNotice")}</Text>
        </View>

        {/* Checkbox de aceptación */}
        <View style={styles.checkboxContainer}>
          <CheckBox
            value={accepted}
            onValueChange={setAccepted}
            color={theme.primaryColor}
            disabled={false}
          />
          <TouchableOpacity onPress={() => setAccepted(!accepted)} style={styles.checkboxLabelWrapper}>
            <Text style={[styles.checkboxLabel, { color: theme.textColor }]}>
              {t("accept.checkboxLabel")}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Enlaces a documentos completos */}
        <View style={styles.linksContainer}>
          <TouchableOpacity onPress={() => setShowTerms(true)} style={styles.linkButton}>
            <Text style={styles.linkText}>{t("accept.termsLink")}</Text>
          </TouchableOpacity>
          <Text style={[styles.linkSeparator, { color: theme.textColor }]}> · </Text>
          <TouchableOpacity onPress={() => setShowPrivacy(true)} style={styles.linkButton}>
            <Text style={styles.linkText}>{t("accept.privacyLink")}</Text>
          </TouchableOpacity>
        </View>

        {/* Contador de menores (si aplica) */}
        {minorsCount > 0 && (
          <View style={styles.minorsInfo}>
            <Text style={[styles.minorsText, { color: theme.textColor }]}>
              {t("accept.coveringMinors", { count: minorsCount })}
            </Text>
          </View>
        )}

        {(!accepted || minorsCount === 0) && (
          <Text style={[styles.mustAccept, { color: theme.errorColor }]}>{t("accept.mustAccept")}</Text>
        )}
      </ScrollView>

      <View style={[styles.footer, { borderTopColor: theme.borderColor }]}>
        <TouchableOpacity
          style={[
            styles.acceptButton,
            accepted ? styles.acceptButtonEnabled : styles.acceptButtonDisabled,
            { backgroundColor: accepted ? theme.primaryColor : theme.disabledColor },
          ]}
          onPress={handleAccept}
          disabled={!accepted}
        >
          <Text style={styles.acceptButtonText}>{t("accept.acceptButton")}</Text>
        </TouchableOpacity>
      </View>
    </BaseModal>
  );
}

// Modales para ver documentos completos (reutilizando LegalInfoModal)
export function TermsModal({ visible, onClose }) {
  const { t } = useTranslation();
  const { theme } = useTheme();

  return (
    <BaseModal visible={visible} onClose={onClose} animationType="slide">
      <Text style={[styles.title, { color: theme.titleColor }]}>{t("inputs.terms")}</Text>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {TERMS_SECTIONS.map(([titleKey, bodyKey]) => (
          <View key={titleKey} style={styles.section}>
            <Text style={[styles.heading, { color: theme.titleColor }]}>{t(titleKey)}</Text>
            <Text style={[styles.body, { color: theme.textColor }]}>{t(bodyKey)}</Text>
          </View>
        ))}
      </ScrollView>
    </BaseModal>
  );
}

export function PrivacyModal({ visible, onClose }) {
  const { t } = useTranslation();
  const { theme } = useTheme();

  return (
    <BaseModal visible={visible} onClose={onClose} animationType="slide">
      <Text style={[styles.title, { color: theme.titleColor }]}>{t("inputs.privacity")}</Text>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {PRIVACY_SECTIONS.map(([titleKey, bodyKey]) => (
          <View key={titleKey} style={styles.section}>
            <Text style={[styles.heading, { color: theme.titleColor }]}>{t(titleKey)}</Text>
            <Text style={[styles.body, { color: theme.textColor }]}>{t(bodyKey)}</Text>
          </View>
        ))}
      </ScrollView>
    </BaseModal>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  content: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
    textAlign: "center",
  },
  noticeContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#FFF3E0",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: "#FF9800",
  },
  noticeIcon: {
    fontSize: 20,
    marginRight: 8,
    marginTop: 2,
  },
  noticeText: {
    fontSize: 12,
    lineHeight: 18,
    flex: 1,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 16,
    padding: 12,
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  checkboxLabelWrapper: {
    flex: 1,
    marginLeft: 8,
    marginTop: 2,
  },
  checkboxLabel: {
    fontSize: 13,
    lineHeight: 19,
  },
  linksContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  linkButton: {
    paddingVertical: 4,
  },
  linkText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1976D2",
  },
  linkSeparator: {
    fontSize: 14,
  },
  minorsInfo: {
    backgroundColor: "#E3F2FD",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  minorsText: {
    fontSize: 13,
    lineHeight: 19,
    textAlign: "center",
    fontWeight: "500",
  },
  mustAccept: {
    fontSize: 12,
    textAlign: "center",
    marginTop: 8,
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
  },
  acceptButton: {
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
    minHeight: 48,
  },
  acceptButtonEnabled: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  acceptButtonDisabled: {
    opacity: 0.6,
  },
  acceptButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  section: {
    marginBottom: 16,
  },
  heading: {
    fontSize: 15,
    fontWeight: "bold",
    marginBottom: 4,
  },
  body: {
    fontSize: 13,
    lineHeight: 19,
  },
});