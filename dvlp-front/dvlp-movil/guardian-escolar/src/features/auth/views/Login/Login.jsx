import React, { useState } from "react";
import { ScrollView, View, Text } from "react-native";
import { Asset } from "expo-asset";
import { SvgUri } from "react-native-svg";
import { styles } from "./Login.styles";
import { useTranslation } from "react-i18next";
import { useTheme } from "@core/services/ThemeService";
import InputField from "@components/inputs/InputField";
import PrimaryButton from "@components/buttons/PrimaryButton";
import { validateEmail, validateRequired } from "@core/validation/validators";
import { login } from "@core/services/authService";
import { getSession, clearSession } from "@core/services/authService";
import { acceptTerms, getPendingAcceptance, getTermsStatus } from "@core/services/termsService";
import { registerPushDevice } from "@core/services/pushService";
import LegalInfoModal from "./LegalInfoModal";
import useSession from "@core/hooks/useSession";

const logoUri = Asset.fromModule(require("../../../../../assets/logo-blue.svg")).uri;

export default function Login({ navigation }) {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [legalDoc, setLegalDoc] = useState(null);
  const { applyAuthRole } = useSession();

  const handleEmailChange = (value) => {
    setEmail(value);
    if (emailError) setEmailError("");
  };

  const handlePasswordChange = (value) => {
    setPassword(value);
    if (passwordError) setPasswordError("");
  };

  const signIn = async () => {
    if (submitting) return;
    setSubmitting(true);
    setFormError("");

    try {
      await login(email, password);
      await applyAuthRole();

      try {
        const session = await getSession();
        if (session?.roleId === 2) {
          try {
            const status = await getTermsStatus();
            if (!status?.accepted) {
              await clearSession();
              setFormError(t("accept.blocked"));
              setSubmitting(false);
              return;
            }
          } catch (e) {
            console.warn("[Login] getTermsStatus failed due to network, skipping:", e?.message);
          }
        } else {
          try {
            const pending = await getPendingAcceptance();
            if (pending?.ownMissing || (pending?.minors && pending.minors.length > 0)) {
              if (pending.minors?.length > 0) {
                await acceptTerms(pending.termsVersion, pending.minors.map((m) => m.profileId));
              }
              if (pending.ownMissing) {
                await acceptTerms(pending.termsVersion, []);
              }
            }
          } catch (e) {
            console.warn("[Login] getPendingAcceptance/acceptTerms failed due to network, skipping:", e?.message);
          }
        }
      } catch (e) {
        if (e?.status) {
          setFormError(t("accept.error"));
          setSubmitting(false);
          return;
        }
        console.warn("[Login] Post-login flow failed due to network, continuing:", e?.message);
      }

      navigation.navigate("MainPage");
      registerPushDevice();
    } catch (error) {
      setFormError(
        error?.status === 401 || error?.status === 400 || error?.status === 403
          ? t("login.error")
          : t("login.networkError")
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = () => {
    console.log('[DEBUG] handleSubmit called', { email, submitting });
    const nextEmailError = validateEmail(email);
    const nextPasswordError = validateRequired(password, "Enter your password");
    setEmailError(nextEmailError);
    setPasswordError(nextPasswordError);
    setFormError("");
    if (nextEmailError || nextPasswordError) return;
    signIn();
  };

  return (
    <ScrollView
      style={{ backgroundColor: theme.bgColor }}
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      <SvgUri uri={logoUri} width={92} height={113} style={styles.icon} />
      <Text style={[styles.title, { color: theme.titleColor }]}>{t("login.title")}</Text>
      <View style={styles.form}>
        <InputField
          label={t("inputs.title.email")}
          placeholder="example@gmail.com"
          value={email}
          onChangeText={handleEmailChange}
          keyboardType="email-address"
          error={emailError}
        />
        <InputField
          label={t("inputs.title.password")}
          placeholder="••••••••"
          value={password}
          onChangeText={handlePasswordChange}
          secureTextEntry
          error={passwordError}
        />
        <Text
          style={[styles.forgotPassword, { color: theme.navbarColor }]}
          onPress={() => navigation.navigate("ForgotPassword")}
        >
          {t("login.ForgotPassword")}
        </Text>
        {formError ? <Text style={styles.error}>{formError}</Text> : null}
        <View style={styles.buttonWrap}>
          <PrimaryButton text={t("button.enter")} onPress={handleSubmit} disabled={submitting} />
        </View>
        <View style={styles.legalRow}>
          <Text style={[styles.legalLink, { color: theme.navbarColor }]} onPress={() => setLegalDoc("terms")}>
            {t("inputs.terms")}
          </Text>
          <Text style={styles.legalSeparator}> · </Text>
          <Text style={[styles.legalLink, { color: theme.navbarColor }]} onPress={() => setLegalDoc("privacy")}>
            {t("inputs.privacity")}
          </Text>
        </View>
      </View>
      <LegalInfoModal visible={legalDoc !== null} doc={legalDoc ?? "terms"} onClose={() => setLegalDoc(null)} />
    </ScrollView>
  );
}