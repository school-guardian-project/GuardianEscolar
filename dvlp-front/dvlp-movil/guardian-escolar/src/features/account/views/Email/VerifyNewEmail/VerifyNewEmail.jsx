import React from "react";
import { useTranslation } from "react-i18next";
import { resetToSection } from "@core/navigation/navigationHelper";

import VerifyScreen from "@components/account/screens/VerifyScreen";

export default function VerifyNewEmail() {
    const { t } = useTranslation();
    return (
        <VerifyScreen
            backLabel={t("profile.title")}
            title={t("account.updateEmail.title")}
            description={t("account.verifyEmail.description")}
            label={t("inputs.email")}
            placeholder={t("updateEmail.placeholder")}
            buttonText={t("button.sendCode")}
            nextScreen="Datas"
            onSuccess={(navigation) => {
                const { pendingProfile, profileUpdateService } = require("@core/api/profileUpdate.service");
                const { useRoleSwitcher } = require("@core/dev/RoleSwitcherContext");
                // No podemos usar hook aquí, actualizamos vía require y luego navega — Datas hará refetch por useFocusEffect
                const email = pendingProfile.getEmail();
                if (email) {
                    profileUpdateService.updateEmail(email).then(() => {
                        console.log('[MOCK-API] móvil updateEmail OK', email);
                        pendingProfile.clear();
                        resetToSection(navigation, "Datas");
                    }).catch(e => {
                        console.warn('[MOCK-API] móvil updateEmail FAIL', e.message);
                        resetToSection(navigation, "Datas");
                    });
                } else {
                    resetToSection(navigation, "Datas");
                }
            }}
        />
    );

}