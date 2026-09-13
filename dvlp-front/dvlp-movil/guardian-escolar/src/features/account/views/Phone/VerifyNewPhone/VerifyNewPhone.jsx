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
            onSuccess={(navigation) => {
                const { pendingProfile, profileUpdateService } = require("@core/api/profileUpdate.service");
                const phone = pendingProfile.getPhone();
                if (phone) {
                    profileUpdateService.updatePhone(phone).then(() => {
                        console.log('[MOCK-API] móvil updatePhone OK', phone);
                        pendingProfile.clear();
                        resetToSection(navigation, "Datas");
                    }).catch(e => {
                        console.warn('[MOCK-API] móvil updatePhone FAIL', e.message);
                        resetToSection(navigation, "Datas");
                    });
                } else {
                    resetToSection(navigation, "Datas");
                }
            }}
        />
    );

}