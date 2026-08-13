import React from "react";
import { useTranslation } from "react-i18next";

import VerifyScreen from "@components/account/screens/VerifyScreen";

export default function VerifyUpdateEmail() {

    const { t } = useTranslation();

    return (

        <VerifyScreen
            backLabel={t("updateEmail.title")}
            title={t("account.updateEmail.title")}
            description={t("account.verifyEmail.description")}
            buttonText={t("button.verifyCode")}
            resendText={t("verifyCode.transferCode")}
            nextScreen="NewEmail"
        />

    );

}