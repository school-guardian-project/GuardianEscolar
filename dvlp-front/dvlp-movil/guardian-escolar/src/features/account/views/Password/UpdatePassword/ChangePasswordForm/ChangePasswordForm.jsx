import React from "react";
import { useTranslation } from "react-i18next";

import PasswordScreen from "@components/account/screens/PasswordScreen";
import { useNavigation } from "@react-navigation/native";
import { resetToSection } from "@core/navigation/navigationHelper";

export default function ChangePasswordForm() {
    const navigation = useNavigation();
    const { t } = useTranslation();

    return (
        <PasswordScreen
            backLabel={t("verifyCode.title")}
            title={t("account.updatePassword.title")}
            description={t("newPassword.description")}
            buttonText={t("button.restore")}
            nextScreen="Security"
             onSuccess={(nav, pwd) => {
                const { profileUpdateService } = require("@core/api/profileUpdate.service");
                const pass = pwd || 'Admin123!';
                profileUpdateService.updatePassword(pass).then(() => {
                    console.log('[MOCK-API] móvil updatePassword OK');
                    resetToSection(nav, "Security");
                }).catch(e => {
                    console.warn('[MOCK-API] móvil updatePassword FAIL', e.message);
                    resetToSection(nav, "Security");
                });
             }}
        />
    );

}