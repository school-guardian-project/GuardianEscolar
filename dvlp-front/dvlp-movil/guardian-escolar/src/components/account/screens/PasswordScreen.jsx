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
    const [pwd, setPwd] = React.useState("");
    const [confirm, setConfirm] = React.useState("");

    const handleSubmit = () => {
        if (pwd && pwd !== confirm) {
            console.warn('[MOCK-API] passwords no coinciden');
            return;
        }
        if (onSuccess) {
            onSuccess(navigation, pwd);
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
                value={pwd}
                onChangeText={setPwd}
            />

            <InputField
                label="Confirmación"
                secureTextEntry
                value={confirm}
                onChangeText={setConfirm}
            />

            <PrimaryButton
                text={buttonText}
                onPress={handleSubmit}
            />
        </AccountLayout>
    );
}