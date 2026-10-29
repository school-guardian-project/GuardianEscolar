import React, { useState } from "react";
import { ScrollView, View, Text, Keyboard, Image } from "react-native";
//import { Asset } from "expo-asset";
//import { SvgUri } from "react-native-svg";
import { styles } from "./Login.styles";
import { useTranslation } from "react-i18next";
import { useTheme } from "@core/services/ThemeService";
import InputField from "@components/inputs/InputField";
import PrimaryButton from "@components/buttons/PrimaryButton";
import { validateEmail, validateRequired } from "@core/validation/validators";
import { login, getSession, clearSession } from "@core/services/authService";
import {
  acceptPending,
  CURRENT_TERMS_VERSION,
  getPendingAcceptance,
  hasPendingAcceptance,
  requiresTermsModal,
} from "@core/services/termsService";
import { registerPushDevice } from "@core/services/pushService";
import LegalInfoModal from "./LegalInfoModal";
import TermsAcceptanceModal from "./TermsAcceptanceModal";
import useSession from "@core/hooks/useSession";



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
  const [pendingTerms, setPendingTerms] = useState(null);
  const [acceptingTerms, setAcceptingTerms] = useState(false);
  const [termsError, setTermsError] = useState("");
  const { applyAuthRole } = useSession();

  const handleEmailChange = (value) => {
    setEmail(value.trim());
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

      // Estudiantes y admin entran directo: el estudiante queda cubierto por la
      // aceptación de su acudiente.
      const session = await getSession();
      if (!requiresTermsModal(session?.roleId)) {
        enterApp();
        return;
      }

      // Conductor y acudiente: solo ven el modal si el backend no tiene registrada
      // la versión vigente. Si la consulta falla, se muestra igual.
      let pending;
      try {
        pending = await getPendingAcceptance();
      } catch (e) {
        console.warn("[Login] getPendingAcceptance failed, showing terms modal:", e?.message);
        pending = { termsVersion: CURRENT_TERMS_VERSION, ownMissing: true, minors: [] };
      }

      if (!hasPendingAcceptance(pending)) {
        enterApp();
        return;
      }

      setPendingTerms(pending);
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

  const enterApp = () => {
    navigation.navigate("MainPage");
    registerPushDevice();
  };

  const handleTermsAccept = async () => {
    setTermsError("");
    setAcceptingTerms(true);
    try {
      await acceptPending(pendingTerms);
      setPendingTerms(null);
      enterApp();
    } catch (e) {
      // El modal sigue abierto para reintentar.
      setTermsError(t("accept.error"));
    } finally {
      setAcceptingTerms(false);
    }
  };

  // Cerrar el modal sin aceptar descarta la sesión ya guardada por login().
  const handleTermsDismiss = async () => {
    setPendingTerms(null);
    setTermsError("");
    await clearSession();
  };

  const handleSubmit = () => {
    console.log('[DEBUG] handleSubmit called', { email, submitting });
    const nextEmailError = validateEmail(email);
    const nextPasswordError = validateRequired(password, "Enter your password");
    setEmailError(nextEmailError);
    setPasswordError(nextPasswordError);
    setFormError("");
    if (nextEmailError || nextPasswordError) return;
    Keyboard.dismiss();
    signIn();
  };

  return (
    <ScrollView
      style={{ backgroundColor: theme.bgColor }}
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      {/* <SvgUri uri={logoUri} width={92} height={113} style={styles.icon} /> */}

      <Image
          source={require("../../../../../assets/adaptive-icon.png")}
          style={[styles.icon, { width: 92, height: 113 }]}
          resizeMode="contain"
        />
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

      <TermsAcceptanceModal
        visible={pendingTerms !== null}
        onClose={handleTermsDismiss}
        onAccept={handleTermsAccept}
        minorsCount={pendingTerms?.minors.length ?? 0}
        submitting={acceptingTerms}
        error={termsError}
      />
    </ScrollView>
  );
}