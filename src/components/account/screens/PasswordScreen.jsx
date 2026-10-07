import React, { useState } from "react";
import { Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";

import AccountLayout from "@components/account/AccountLayout";
import InputField from "@components/inputs/InputField";
import PrimaryButton from "@components/buttons/PrimaryButton";
import { serviceErrorKey } from "@core/services/forgotInformationService";
import styles from "@core/styles/accountScreen.style";

export default function PasswordScreen({
    title,
    description,
    buttonText,
    nextScreen,
    onSuccess,
    onSubmit,
}) {
    const navigation = useNavigation();
    const { t } = useTranslation();
    const [password, setPassword] = useState("");
    const [confirmation, setConfirmation] = useState("");
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async () => {
        if (submitting) return;
        if (password !== confirmation) {
            setError(t("serviceErrors.passwordMismatch"));
            return;
        }
        if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.\-_])[A-Za-z\d@$!%*?&.\-_]{8,}$/.test(password)) {
            setError(t("serviceErrors.weakPassword"));
            return;
        }

        setError("");
        setSubmitting(true);
        try {
            if (onSubmit) await onSubmit(password, confirmation);
            if (onSuccess) await onSuccess(navigation);
            else if (nextScreen) navigation.navigate(nextScreen);
        } catch (submitError) {
            setError(t(serviceErrorKey(submitError, "password")));
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <AccountLayout
            backLabel={title}
            title={title}
            description={description}
        >
            <InputField
                label={t("inputs.title.password")}
                placeholder={t("inputs.newPasswordPlaceholder")}
                secureTextEntry
                value={password}
                onChangeText={(value) => { setPassword(value); setError(""); }}
            />

            <InputField
                label={t("inputs.confirmPassword")}
                placeholder={t("inputs.confirmPasswordPlaceholder")}
                secureTextEntry
                value={confirmation}
                onChangeText={(value) => { setConfirmation(value); setError(""); }}
            />

            {error ? <Text style={styles.error}>{error}</Text> : null}
            <PrimaryButton
                text={buttonText}
                onPress={handleSubmit}
                disabled={submitting}
            />
        </AccountLayout>
    );
}