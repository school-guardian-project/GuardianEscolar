import React from "react";
import { useTranslation } from "react-i18next";

import PasswordScreen from "@components/account/screens/PasswordScreen";

export default function NewPassword() {

    const { t } = useTranslation();

    return (

        <PasswordScreen
            backLabel={t("verifyCode.title")}
            title={t("newPassword.title")}
            description={t("newPassword.description")}
            buttonText={t("button.restore")}
            nextScreen="Login"
        />

    );

}