import React, { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";

import AccountLayout from "@components/account/AccountLayout";
import CodeInput from "@components/inputs/CodeInput";
import { useTheme } from "@core/services/ThemeService";
import PrimaryButton from "@components/buttons/PrimaryButton";
import { serviceErrorKey } from "@core/services/forgotInformationService";



const RESEND_COOLDOWN_SECONDS = 30;

const localStyles = StyleSheet.create({
    resend: {
        alignItems: "center",
        marginTop: 16,
    },
    resendText: {
        fontWeight: "600",
    },
    error: {
        color: "#D32F2F",
        textAlign: "center",
        marginBottom: 12,
    },
});

export default function VerifyScreen({
    backLabel,
    title,
    description,
    buttonText,
    resendText,
    nextScreen,
    onSuccess,
    onSubmit,
    onResend,
}) {
    const navigation = useNavigation();
    const { theme } = useTheme();
    const { t } = useTranslation();
    const [code, setCode] = useState("");
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [resending, setResending] = useState(false);
    const [secondsLeft, setSecondsLeft] = useState(RESEND_COOLDOWN_SECONDS);

    useEffect(() => {
        if (secondsLeft <= 0) return undefined;
        const timer = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
        return () => clearTimeout(timer);
    }, [secondsLeft]);

    const handleSubmit = async () => {
        if (submitting) return;
        if (!/^\d{6}$/.test(code)) {
            setError(t("serviceErrors.invalidCode"));
            return;
        }

        setError("");
        setSubmitting(true);
        try {
            if (onSubmit) await onSubmit(code);
            if (onSuccess) await onSuccess(navigation);
            else if (nextScreen) navigation.navigate(nextScreen);
        } catch (submitError) {
            setError(t(serviceErrorKey(submitError, "code")));
        } finally {
            setSubmitting(false);
        }
    };

    const handleResend = async () => {
        if (!onResend || resending || secondsLeft > 0) return;
        setError("");
        setResending(true);
        try {
            await onResend();
        } catch (resendError) {
            setError(t(serviceErrorKey(resendError)));
        } finally {
            setResending(false);
        }
    };

    return (
        <AccountLayout
            backLabel={backLabel || title}
            title={title}
            description={description}
        >
            <CodeInput
                value={code}
                onChangeText={(value) => {
                    setCode(value);
                    if (error) setError("");
                }}
            />
            {error ? <Text style={localStyles.error} accessibilityRole="alert">{error}</Text> : null}
            <PrimaryButton
                text={buttonText}
                onPress={handleSubmit}
                disabled={submitting}
            />
            {onResend ? (
                <Pressable
                    style={localStyles.resend}
                    onPress={handleResend}
                    disabled={resending || secondsLeft > 0}
                    accessibilityRole="button"
                >
                    <Text
                        style={[
                            localStyles.resendText,
                            { color: secondsLeft > 0 || resending ? "#9E9E9E" : theme.buttonApply },
                        ]}
                    >
                        {resending
                            ? t("serviceErrors.sending")
                            : secondsLeft > 0
                                ? t("serviceErrors.resendIn", { seconds: secondsLeft })
                                : resendText}
                    </Text>
                </Pressable>
            ) : null}
        </AccountLayout>
    );
}