import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator } from "react-native";
import { useTranslation } from "react-i18next";
import { useTheme } from "@core/services/ThemeService";

import BaseModal from "@components/modals/BaseModal";
import LegalInfoModal from "./LegalInfoModal";

/**
 * Modal para aceptación de términos y autorización de datos de menores.
 * Incluye checkbox obligatorio conforme a Ley 1581 de 2012.
 * React Native ya no trae CheckBox en su núcleo: se dibuja con View + TouchableOpacity.
 */
export default function TermsAcceptanceModal({
  visible,
  onClose,
  onAccept,
  minorsCount = 0,
  submitting = false,
  error = "",
}) {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const [accepted, setAccepted] = useState(false);
  const [legalDoc, setLegalDoc] = useState(null);

  // Cada apertura empieza sin marcar.
  useEffect(() => {
    if (visible) setAccepted(false);
  }, [visible]);

  const canAccept = accepted && !submitting;

  const handleAccept = () => {
    if (!canAccept) return;
    onAccept?.();
  };

  return (
    <BaseModal visible={visible} onClose={submitting ? undefined : onClose} animationType="slide">
      <View style={[styles.header, { borderBottomColor: theme.borderColor }]}>
        <Text style={[styles.title, { color: theme.titleColor }]}>{t("accept.title")}</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <Text style={styles.subtitle}>{t("accept.subtitle")}</Text>

        {/* Aviso legal Ley 1581 */}
        <View style={styles.noticeContainer}>
          <Text style={styles.noticeIcon}>⚖️</Text>
          <Text style={styles.noticeText}>{t("accept.minorDataNotice")}</Text>
        </View>

        {/* Checkbox de aceptación */}
        <TouchableOpacity
          style={styles.checkboxContainer}
          onPress={() => setAccepted(!accepted)}
          disabled={submitting}
          accessibilityRole="checkbox"
          accessibilityState={{ checked: accepted, disabled: submitting }}
        >
          <View
            style={[
              styles.checkbox,
              { borderColor: theme.buttonApply },
              accepted && { backgroundColor: theme.buttonApply },
            ]}
          >
            {accepted ? <Text style={styles.checkmark}>✓</Text> : null}
          </View>
          <Text style={styles.checkboxLabel}>{t("accept.checkboxLabel")}</Text>
        </TouchableOpacity>

        {/* Enlaces a documentos completos */}
        <View style={styles.linksContainer}>
          <TouchableOpacity onPress={() => setLegalDoc("terms")} style={styles.linkButton}>
            <Text style={[styles.linkText, { color: theme.navbarColor }]}>{t("accept.termsLink")}</Text>
          </TouchableOpacity>
          <Text style={styles.linkSeparator}> · </Text>
          <TouchableOpacity onPress={() => setLegalDoc("privacy")} style={styles.linkButton}>
            <Text style={[styles.linkText, { color: theme.navbarColor }]}>{t("accept.privacyLink")}</Text>
          </TouchableOpacity>
        </View>

        {/* Contador de menores (si aplica) */}
        {minorsCount > 0 && (
          <View style={styles.minorsInfo}>
            <Text style={styles.minorsText}>{t("accept.coveringMinors", { count: minorsCount })}</Text>
          </View>
        )}

        {!accepted && (
          <Text style={[styles.message, { color: theme.alertIcon }]}>{t("accept.mustAccept")}</Text>
        )}
        {error ? <Text style={[styles.message, { color: theme.alertIcon }]}>{error}</Text> : null}
      </ScrollView>

      <View style={[styles.footer, { borderTopColor: theme.borderColor }]}>
        <TouchableOpacity
          style={[
            styles.acceptButton,
            { backgroundColor: canAccept ? theme.buttonApply : theme.inputBorder },
          ]}
          onPress={handleAccept}
          disabled={!canAccept}
        >
          {submitting ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.acceptButtonText}>{t("accept.acceptButton")}</Text>
          )}
        </TouchableOpacity>
      </View>

      <LegalInfoModal visible={legalDoc !== null} doc={legalDoc ?? "terms"} onClose={() => setLegalDoc(null)} />
    </BaseModal>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  content: {
    paddingVertical: 16,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
    textAlign: "center",
    color: "#444",
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
    color: "#444",
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
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 4,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 1,
  },
  checkmark: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "bold",
    lineHeight: 16,
  },
  checkboxLabel: {
    flex: 1,
    marginLeft: 10,
    fontSize: 13,
    lineHeight: 19,
    color: "#444",
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
  },
  linkSeparator: {
    fontSize: 14,
    color: "#444",
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
    color: "#444",
  },
  message: {
    fontSize: 12,
    textAlign: "center",
    marginTop: 8,
  },
  footer: {
    paddingTop: 12,
    borderTopWidth: 1,
  },
  acceptButton: {
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 48,
  },
  acceptButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
