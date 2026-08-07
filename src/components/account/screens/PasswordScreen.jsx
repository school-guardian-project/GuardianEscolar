import React from "react";
import { useNavigation } from "@react-navigation/native";

import AccountLayout from "@components/account/AccountLayout";
import InputField from "@components/inputs/InputField";
import PrimaryButton from "@components/buttons/PrimaryButton";

export default function PasswordScreen({
    title,
    description,
    buttonText,
    nextScreen,
    onSuccess,
}) {

    const navigation = useNavigation();

    const handleSubmit = () => {
        if (onSuccess) {
            onSuccess(navigation);
            return;
        }

        navigation.navigate(nextScreen);
    };

    return (
        <AccountLayout
            backLabel={title}
            title={title}
            description={description}
        >
            <InputField
                label="Nueva contraseña"
                secureTextEntry
            />

            <InputField
                label="Confirmación"
                secureTextEntry
            />

            <PrimaryButton
                text={buttonText}
                onPress={handleSubmit}
            />
        </AccountLayout>
    );
}