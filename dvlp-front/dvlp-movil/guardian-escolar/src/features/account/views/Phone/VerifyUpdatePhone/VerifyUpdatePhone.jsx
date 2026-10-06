import React from "react";
import { useTranslation } from "react-i18next";

import VerifyScreen from "@components/account/screens/VerifyScreen";

export default function VerifyUpdatePhone() {

    const { t } = useTranslation();

    return (

        <VerifyScreen
            backLabel={t("updatePhone.title")}
            title={t("account.updatePhone.title")}
            description={t("account.verifyPhone.descriptionVerify")}
            buttonText={t("button.verifyCode")}
            resendText={t("verifyCode.transferCode")}
            nextScreen="NewPhone"
        />

    );

}