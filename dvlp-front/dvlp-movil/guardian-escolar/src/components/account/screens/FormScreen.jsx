
import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";

import AccountLayout from "@components/account/AccountLayout";
import InputField from "@components/inputs/InputField";
import PrimaryButton from "@components/buttons/PrimaryButton";
import { validateEmail, validatePhone } from "@core/validation/validators";

export default function FormScreen({
    title,
    description,
    label,
    placeholder,
    buttonText,
    nextScreen,
    value,
    onChangeText,
    onSubmit,
}) {

    const navigation = useNavigation();
    const [value, setValue] = useState("");
    const [error, setError] = useState("");

    const handleChangeText = (text) => {
        setValue(text);

        if (error) {
            setError("");
        }
    };

    const handleSubmit = () => {
        const fieldName = `${label || ""} ${placeholder || ""}`.toLowerCase();
        const isEmail = fieldName.includes("correo") || fieldName.includes("email");
        const isPhone =
            fieldName.includes("teléfono") ||
            fieldName.includes("telefono") ||
            fieldName.includes("phone") ||
            fieldName.includes("número") ||
            fieldName.includes("numero");

        const validationError = isEmail
            ? validateEmail(value)
            : isPhone
                ? validatePhone(value)
                : value.trim()
                    ? ""
                    : "Este campo es obligatorio";

        if (validationError) {
            setError(validationError);
            return;
        }

        setError("");
        navigation.navigate(nextScreen);
    };

    const handlePress = () => {
        if (onSubmit) {
            onSubmit(navigation);
        } else {
            navigation.navigate(nextScreen);
        }
    };

    return (

        <AccountLayout
            backLabel={title}
            title={title}
            description={description}
        >

            <InputField
                label={label}
                placeholder={placeholder}
                value={value}
                onChangeText={onChangeText}
            />

            <PrimaryButton
                text={buttonText}
                onPress={handlePress}
            />

        </AccountLayout>

    );

}
