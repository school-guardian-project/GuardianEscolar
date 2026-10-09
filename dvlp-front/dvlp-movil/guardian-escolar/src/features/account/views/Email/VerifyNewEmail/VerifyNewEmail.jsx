import React from "react";
import { useTranslation } from "react-i18next";
import { resetToSection } from "@core/navigation/navigationHelper";
import { updateSessionEmail } from "@core/services/authService";
import {
    confirmEmailChange,
    resendNewEmailCode,
    verifyNewEmailCode,
} from "@core/services/forgotInformationService";

import VerifyScreen from "@components/account/screens/VerifyScreen";

export default function VerifyNewEmail() {

    const { t } = useTranslation();

    return (

        <VerifyScreen
            backLabel={t("profile.title")}
            title={t("account.updateEmail.title")}
            description={t("account.verifyEmail.description")}
            buttonText={t("button.verifyCode")}
            resendText={t("verifyCode.transferCode")}
            onResend={resendNewEmailCode}
            onSubmit={async (code) => {
                await verifyNewEmailCode(code);
                const email = await confirmEmailChange();
                await updateSessionEmail(email);
            }}
            onSuccess={(navigation) =>
                resetToSection(navigation, "Datas")
            }
        />

    );

}