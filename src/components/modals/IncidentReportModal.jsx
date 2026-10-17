import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useTranslation } from "react-i18next";
import BaseModal from "@components/modals/BaseModal";
import { useTheme } from "@core/services/ThemeService";
import { reportIncident } from "@core/services/notificationApi";
import { INCIDENT_TYPES, MAX_INCIDENT_DESCRIPTION } from "@core/config/incidents";
import { incidentErrorKey } from "@core/services/incidentErrors";

/**
 * Formulario del conductor para reportar un incidente o emergencia (FR-8.1).
 *
 * El conductor solo elige el tipo y, si quiere, agrega un detalle. El viaje sale
 * del token de sesion y a quien avisar lo decide el servidor (FR-8.2): el
 * cliente no manda ni viaje ni destinatarios.
 */
export default function IncidentReportModal({ visible, onClose }) {
  const { theme } = useTheme();
  const { t } = useTranslation();

  const [alertTypeId, setAlertTypeId] = useState(null);
  const [description, setDescription] = useState("");
  const [sending, setSending] = useState(false);
  const [outcome, setOutcome] = useState(null);

  // Cada apertura arranca limpia: no se reusa el tipo del reporte anterior.
  useEffect(() => {
    if (!visible) {
      setAlertTypeId(null);
      setDescription("");
      setSending(false);
      setOutcome(null);
    }
  }, [visible]);

  const submit = async () => {
    if (alertTypeId === null || sending) {
      return;
    }

    setSending(true);
    setOutcome(null);

    const detail = description.trim();

    try {
      const response = await reportIncident({
        alertTypeId,
        // No se manda `description` vacia: el backend la guarda como null.
        ...(detail ? { description: detail } : {}),
      });
      setOutcome({ ok: true, notified: response?.recipientsNotified ?? 0 });
    } catch (error) {
      setOutcome({ ok: false, messageKey: incidentErrorKey(error) });
    } finally {
      setSending(false);
    }
  };

  const renderForm = () => (
    <>
      <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
        {t("incidents.subtitle")}
      </Text>

      {INCIDENT_TYPES.map((type) => {
        const selected = alertTypeId === type.alertTypeId;

        return (
          <Pressable
            key={type.alertTypeId}
            style={[
              styles.option,
              {
                backgroundColor: selected ? theme.alertBg : theme.cardSecondaryBg,
                borderColor: selected ? theme.alertIcon : theme.borderColor,
              },
            ]}
            onPress={() => setAlertTypeId(type.alertTypeId)}
            accessibilityRole="radio"
            accessibilityState={{ selected }}
          >
            <View
              style={[
                styles.radio,
                { borderColor: selected ? theme.alertIcon : theme.borderColor },
              ]}
            >
              {selected && (
                <View
                  style={[styles.radioDot, { backgroundColor: theme.alertIcon }]}
                />
              )}
            </View>
            <Text style={[styles.optionLabel, { color: theme.textColor }]}>
              {t(type.labelKey)}
            </Text>
          </Pressable>
        );
      })}

      <Text style={[styles.label, { color: theme.textSecondary }]}>
        {t("incidents.descriptionLabel")}
      </Text>
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: theme.inputBg,
            borderColor: theme.inputBorder,
            color: theme.textColor,
          },
        ]}
        value={description}
        onChangeText={setDescription}
        placeholder={t("incidents.descriptionPlaceholder")}
        placeholderTextColor={theme.cardColorInput}
        maxLength={MAX_INCIDENT_DESCRIPTION}
        multiline
        editable={!sending}
      />

      {outcome && !outcome.ok && (
        <Text style={[styles.feedback, { color: theme.alertIcon }]}>
          {t(outcome.messageKey)}
        </Text>
      )}

      <Pressable
        style={[
          styles.action,
          {
            backgroundColor: theme.alertIcon,
            opacity: alertTypeId === null || sending ? 0.5 : 1,
          },
        ]}
        onPress={submit}
        disabled={alertTypeId === null || sending}
      >
        {sending ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={styles.actionText}>{t("incidents.submit")}</Text>
        )}
      </Pressable>
    </>
  );

  const renderSuccess = () => (
    <>
      <Text style={[styles.feedback, { color: theme.textColor }]}>
        {outcome.notified > 0
          ? t("incidents.success", { notified: outcome.notified })
          : t("incidents.successNoRecipients")}
      </Text>

      <Pressable
        style={[styles.action, { backgroundColor: theme.buttonApply }]}
        onPress={onClose}
      >
        <Text style={styles.actionText}>{t("incidents.done")}</Text>
      </Pressable>
    </>
  );

  return (
    <BaseModal visible={visible} onClose={onClose} animationType="slide">
      <Text style={[styles.title, { color: theme.textColor }]}>
        {t("incidents.title")}
      </Text>

      <ScrollView
        style={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        {outcome?.ok ? renderSuccess() : renderForm()}
      </ScrollView>
    </BaseModal>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 16,
  },
  scroll: {
    flexGrow: 0,
    maxHeight: 460,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 12,
    marginBottom: 8,
    gap: 10,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  optionLabel: {
    fontSize: 15,
    fontWeight: "500",
  },
  label: {
    fontSize: 13,
    marginTop: 8,
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    minHeight: 80,
    textAlignVertical: "top",
  },
  feedback: {
    fontSize: 14,
    marginTop: 12,
    textAlign: "center",
  },
  action: {
    borderRadius: 25,
    height: 52,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 16,
  },
  actionText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 16,
  },
});
