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

}){

    const navigation=useNavigation();

    return(

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
                onPress={()=>navigation.navigate(nextScreen)}
            />

        </AccountLayout>

    )

}