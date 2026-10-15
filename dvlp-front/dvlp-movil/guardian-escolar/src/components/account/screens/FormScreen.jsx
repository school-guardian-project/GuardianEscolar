
import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";

import AccountLayout from "@components/account/AccountLayout";
import InputField from "@components/inputs/InputField";
import PrimaryButton from "@components/buttons/PrimaryButton";
import { normalizePhone, serviceErrorKey } from "@core/services/forgotInformationService";

export default function FormScreen({
    backLabel,
    title,
    description,
    label,
    placeholder,
    buttonText,
    nextScreen,
    initialValue = "",
    inputType = "text",
    editable = true,
    onSubmit,
    errorContext,
}) {
    const navigation = useNavigation();
    const { t } = useTranslation();
    const [value, setValue] = useState(initialValue);
    const [error, setError] = useState("");
    const [requestError, setRequestError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => setValue(initialValue), [initialValue]);

    const handleChangeText = (text) => {
        setValue(text);
        if (error) {
            setError("");
        }
        if (requestError) {
            setRequestError("");
        }
    };

    const validate = () => {
        const normalized = value.trim();
        if (!normalized) {
            return t("serviceErrors.required");
        }
        if (inputType === "email" &&
            (normalized.length > 100 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized))) {
            return t("serviceErrors.invalidEmail");
        }
        if (inputType === "phone" && !/^\+[1-9]\d{7,14}$/.test(normalizePhone(normalized))) {
            return t("serviceErrors.invalidPhone");
        }
        return "";
    };

    const handleSubmit = async () => {
        if (submitting) return;

        const validationError = validate();
        if (validationError) {
            setError(validationError);
            return;
        }

        setError("");
        setRequestError("");
        setSubmitting(true);
        try {
            if (onSubmit) {
                await onSubmit(value.trim());
            }
            if (nextScreen) navigation.navigate(nextScreen);
        } catch (submitError) {
            setRequestError(t(serviceErrorKey(submitError, errorContext || inputType)));
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <AccountLayout
            backLabel={backLabel || title}
            title={title}
            description={description}
        >
            <InputField
                label={label}
                placeholder={placeholder}
                value={value}
                onChangeText={handleChangeText}
                keyboardType={inputType === "email" ? "email-address" : inputType === "phone" ? "phone-pad" : "default"}
                autoCapitalize={inputType === "email" ? "none" : "sentences"}
                editable={editable}
                error={error || requestError}
            />
            <PrimaryButton
                text={buttonText}
                onPress={handleSubmit}
                disabled={submitting}
            />
        </AccountLayout>
    );
}
