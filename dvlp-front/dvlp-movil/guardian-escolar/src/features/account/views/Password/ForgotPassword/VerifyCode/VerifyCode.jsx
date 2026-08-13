import React from "react";
import { useTranslation } from "react-i18next";

import VerifyScreen from "@components/account/screens/VerifyScreen";

export default function VerifyCode() {

    const { t } = useTranslation();

    return (

        <VerifyScreen
            backLabel={t("forgotPassword.title")}
            title={t("verifyCode.title")}
            description={t("verifyCode.description")}
            buttonText={t("button.verifyCode")}
            resendText={t("verifyCode.transferCode")}
            nextScreen="NewPassword"
        />

    );

}