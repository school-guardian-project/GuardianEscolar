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
            onSuccess={(navigation) =>
                            resetToSection(navigation, "Datas")
                        }
        />

    );

}