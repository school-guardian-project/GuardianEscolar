import React from "react";
import { useTranslation } from "react-i18next";
import { resetToSection } from "@core/navigation/navigationHelper";
import VerifyScreen from "@components/account/screens/VerifyScreen";

export default function VerifyNewPhone() {

    const { t } = useTranslation();

    return (

        <VerifyScreen
            backLabel={t("updateEmail.title")}
            title={t("account.updatePhone.title")}
            description={t("verifyEmail.description")}
            buttonText={t("button.verifyCode")}
            resendText={t("verifyCode.transferCode")}
            nextScreen="Profile"
            onSuccess={(navigation) =>
                resetToSection(navigation, "Datas")
            }
        />

    );

}