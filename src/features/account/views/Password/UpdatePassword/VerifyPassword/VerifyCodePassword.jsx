import React from "react";
import { useTranslation } from "react-i18next";

import VerifyScreen from "@components/account/screens/VerifyScreen";

export default function VerifyCodePassword() {

    const { t } = useTranslation();

    return (

        <VerifyScreen
            backLabel={t("forgotPassword.title")}
            title={t("account.updatePassword.title")}
            description={t("verifyCode.description")}
            buttonText={t("button.verifyCode")}
            resendText={t("verifyCode.transferCode")}
            nextScreen="ChangePasswordForm"
        />

    );

}