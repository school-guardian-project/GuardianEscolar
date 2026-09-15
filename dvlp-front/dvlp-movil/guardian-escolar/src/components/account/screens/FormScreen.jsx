
import React from "react";
import { useNavigation } from "@react-navigation/native";

import AccountLayout from "@components/account/AccountLayout";
import InputField from "@components/inputs/InputField";
import PrimaryButton from "@components/buttons/PrimaryButton";

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