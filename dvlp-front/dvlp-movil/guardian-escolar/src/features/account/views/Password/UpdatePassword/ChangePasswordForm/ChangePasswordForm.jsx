import React from "react";
import { useTranslation } from "react-i18next";

import PasswordScreen from "@components/account/screens/PasswordScreen";
import { useNavigation } from "@react-navigation/native";
import { resetToSection } from "@core/navigation/navigationHelper";
import { useRoleSwitcher } from "@core/dev/RoleSwitcherContext";

export default function ChangePasswordForm() {
    const navigation = useNavigation();
    const { t } = useTranslation();
    const { session } = useRoleSwitcher();

    return (
        <PasswordScreen
            backLabel={t("verifyCode.title")}
            title={t("account.updatePassword.title")}
            description={t("newPassword.description")}
            buttonText={t("button.restore")}
            nextScreen="Security"
             onSuccess={(nav, pwd) => {
                const { profileUpdateService } = require("@core/api/profileUpdate.service");
                const sessionEmail = session?.person?.email;
                if (!pwd) {
                    console.warn('[MOCK-API] contraseña vacía');
                    return;
                }
                if (!sessionEmail) {
                    console.warn('[MOCK-API] sesión no disponible');
                    resetToSection(nav, "Security");
                    return;
                }
                profileUpdateService.updatePassword(pwd, sessionEmail).then(() => {
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