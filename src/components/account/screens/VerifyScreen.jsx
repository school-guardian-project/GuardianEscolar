import React from "react";
import { Pressable, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";

import AccountLayout from "@components/account/AccountLayout";
import CodeInput from "@components/inputs/CodeInput";
import PrimaryButton from "@components/buttons/PrimaryButton";

import styles from "@core/styles/accountScreen.style";

export default function VerifyScreen({

    title,
    description,
    buttonText,
    resendText,
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

            <CodeInput />

            <PrimaryButton
                text={buttonText}
                onPress={handleSubmit}
            />

            <Pressable style={styles.link}>
                <Text>{resendText}</Text>
            </Pressable>

        </AccountLayout>

    )

}