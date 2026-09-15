import React from "react";
import { useTranslation } from "react-i18next";
import { resetToSection } from "@core/navigation/navigationHelper";
import VerifyScreen from "@components/account/screens/VerifyScreen";
import { useRoleSwitcher } from "@core/dev/RoleSwitcherContext";

export default function VerifyNewEmail() {
    const { t } = useTranslation();
    const { session, setSession } = useRoleSwitcher();
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
                const email = pendingProfile.getEmail();
                const sessionEmail = session?.person?.email;
                if (email && sessionEmail) {
                    profileUpdateService.updateEmail(email, sessionEmail).then(() => {
                        console.log('[MOCK-API] móvil updateEmail OK', email);
                        if (session?.person) {
                            setSession({ ...session, person: { ...session.person, email } });
                        }
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