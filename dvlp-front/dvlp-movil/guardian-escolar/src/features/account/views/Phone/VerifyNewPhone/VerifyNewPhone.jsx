import React from "react";
import { useTranslation } from "react-i18next";
import { resetToSection } from "@core/navigation/navigationHelper";
import VerifyScreen from "@components/account/screens/VerifyScreen";
import { resendNewPhoneCode, verifyNewPhoneCode } from "@core/services/forgotInformationService";

export default function VerifyNewPhone() {

    const { t } = useTranslation();

    return (

        <VerifyScreen
            backLabel={t("account.updatePhone.title")}
            title={t("account.updatePhone.title")}
            description={t("account.verifyPhone.descriptionVerify")}
            buttonText={t("button.verifyCode")}
            resendText={t("verifyCode.transferCode")}
            onResend={resendNewPhoneCode}
            nextScreen="Profile"
            onSubmit={verifyNewPhoneCode}
            onSuccess={(navigation) =>
                resetToSection(navigation, "Datas")
            }
        />

    );

}