import React from "react";
import { useTranslation } from "react-i18next";

import PasswordScreen from "@components/account/screens/PasswordScreen";

export default function ChangePasswordForm() {

    const { t } = useTranslation();

    return (

        <PasswordScreen
            backLabel={t("verifyCode.title")}
            title={t("account.updatePassword.title")}
            description={t("newPassword.description")}
            buttonText={t("button.restore")}
            nextScreen="Security"
        />

    );

}