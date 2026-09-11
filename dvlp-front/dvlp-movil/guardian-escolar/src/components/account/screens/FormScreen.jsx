
import React, { useState } from "react";
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
}) {

    const navigation = useNavigation();
    const [value, setValue] = useState("");

    
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
                onChangeText={setValue}
            />

            <PrimaryButton
                text={buttonText}
                onPress={() => navigation.navigate(nextScreen)}
            />

        </AccountLayout>

    );

}