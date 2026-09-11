import React from "react";
import { useTranslation } from "react-i18next";

import FormScreen from "@components/account/screens/FormScreen";

export default function UpdateEmail() {

    const { t } = useTranslation();

    return (

        <FormScreen
            backLabel={t("profile.title")}
            title={t("account.updateEmail.title")}
            description={t("account.updateEmail.description")}
            label={t("inputs.email")}
            placeholder={t("inputs.emailPlaceholder")}
            buttonText={t("button.sendCode")}
            nextScreen="VerifyUpdateEmail"
        />

    );

}