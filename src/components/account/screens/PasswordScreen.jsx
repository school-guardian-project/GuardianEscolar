import React, { useState } from "react";
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
    const [password, setPassword] = useState("");
    const [confirmation, setConfirmation] = useState("");

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
                value={password}
                onChangeText={setPassword}
            />

            <InputField
                label="Confirmación"
                secureTextEntry
                value={confirmation}
                onChangeText={setConfirmation}
            />

            <PrimaryButton
                text={buttonText}
                onPress={handleSubmit}
            />
        </AccountLayout>
    );
}