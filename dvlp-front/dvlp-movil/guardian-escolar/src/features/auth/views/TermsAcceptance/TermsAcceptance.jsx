import React, { useState } from "react";
import { View, Text, ScrollView } from "react-native";
import { useTranslation } from "react-i18next";
import { useTheme } from "@core/services/ThemeService";

import BackButton from "@components/buttons/BackButton";
import BottomTabBar from "@components/layout/BottomTabBar";
import InfoCard from "@components/cards/InfoCard";
import PrimaryButton from "@components/buttons/PrimaryButton";

import { acceptTerms, CURRENT_TERMS_VERSION } from "@core/services/termsService";

import styles from "@core/styles/profileScreen.style";

/**
 * Paso bloqueante post-login: sin aceptación registrada no hay acceso.
 * Recibe por params { minors: [{profileId, name}], ownMissing, termsVersion }.
 */
export default function TermsAcceptance({ navigation, route }) {
  const { theme } = useTheme();
  const { t } = useTranslation();

  const minors = route?.params?.minors ?? [];
  const ownMissing = route?.params?.ownMissing ?? true;
  const version = route?.params?.termsVersion || CURRENT_TERMS_VERSION;

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleAccept = async () => {
    if (submitting) {
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      if (minors.length > 0) {
        await acceptTerms(
          version,
          minors.map((m) => m.profileId)
        );
      }
      if (ownMissing) {
        await acceptTerms(version, []);
      }
      navigation.navigate("MainPage");
    } catch {
      setError(t("accept.error"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.bgColor }]}>
      <View style={styles.header}>
        <BackButton label={t("inputs.terms")} backTo="Login" />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <InfoCard>
          <Text style={styles.description}>{t("accept.description")}</Text>
          <Text style={styles.description}>
            {t("terms.descriAcceptance")}
          </Text>
          <Text style={styles.description}>
            {t("terms.descriContact")}
          </Text>

          {minors.length > 0 ? (
            <Text style={styles.description}>
              {t("accept.minors")}: {minors.map((m) => m.name).join(", ")}
            </Text>
          ) : null}

          {error ? <Text style={{ color: "#D32F2F" }}>{t("accept.error")}</Text> : null}

          <PrimaryButton
            text={t("accept.button")}
            onPress={handleAccept}
            disabled={submitting}
          />
        </InfoCard>
      </ScrollView>

      <BottomTabBar />
    </View>
  );
}
