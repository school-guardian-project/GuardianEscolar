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
import { getSession } from "@core/services/authService";
import { acceptTerms, CURRENT_TERMS_VERSION } from "@core/services/termsService";
import { getLinkedStudents } from "@core/services/familyService";
import { registerPushDevice } from "@core/services/pushService";
import LegalInfoModal from "./LegalInfoModal";
import TermsAcceptanceModal from "./TermsAcceptanceModal";
import AsyncStorage from "@react-native-async-storage/async-storage";
import useSession from "@core/hooks/useSession";

const TERMS_ACCEPTED_KEY = "@guardian_terms_accepted";

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
  const [termsModalVisible, setTermsModalVisible] = useState(false);
  const [minorsCount, setMinorsCount] = useState(0);
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

      try {
        const session = await getSession();
        const roleId = session?.roleId;

        // Estudiantes (roleId 2) no ven el modal: el padre/tutor ya aceptó el tratamiento
        // de datos de sus hijos al aceptar él mismo.
        if (roleId === 2) {
          navigation.navigate("MainPage");
          registerPushDevice();
          return;
        }

        // Solo driver (3) y parent (4) pasan por aceptación de términos y privacidad.
        if (roleId === 3 || roleId === 4) {
          const alreadyAccepted = await AsyncStorage.getItem(TERMS_ACCEPTED_KEY);
          if (alreadyAccepted === CURRENT_TERMS_VERSION) {
            navigation.navigate("MainPage");
            registerPushDevice();
            return;
          }

          // Si es parent, calcular cuántos hijos vinculados tiene para aceptar por ellos.
          let studentProfileIds = [];
          if (roleId === 4) {
            try {
              const linked = await getLinkedStudents(session);
              studentProfileIds = linked.map((m) => m.profileId);
            } catch {
              studentProfileIds = [];
            }
          }

          setMinorsCount(studentProfileIds.length);
          setTermsModalVisible(true);
        } else {
          // Admin y otros roles: no se muestra el modal de términos.
          navigation.navigate("MainPage");
          registerPushDevice();
        }
      } catch (e) {
        console.warn("[Login] Post-login terms flow failed due to network, continuing:", e?.message);
        navigation.navigate("MainPage");
        registerPushDevice();
      }
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

  const handleTermsAccept = async () => {
    try {
      const session = await getSession();
      const roleId = session?.roleId;

      let studentProfileIds = [];
      if (roleId === 4) {
        try {
          const linked = await getLinkedStudents(session);
          studentProfileIds = linked.map((m) => m.profileId);
        } catch {
          studentProfileIds = [];
        }
      }

      await acceptTerms(CURRENT_TERMS_VERSION, studentProfileIds);
      await AsyncStorage.setItem(TERMS_ACCEPTED_KEY, CURRENT_TERMS_VERSION);
      setTermsModalVisible(false);
      navigation.navigate("MainPage");
      registerPushDevice();
    } catch (e) {
      setFormError(t("accept.error"));
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

      <TermsAcceptanceModal
        visible={termsModalVisible}
        onClose={() => setTermsModalVisible(false)}
        onAccept={handleTermsAccept}
        minorsCount={minorsCount}
      />
    </ScrollView>
  );
}