import React from "react";
import { useTranslation } from "react-i18next";

import FormScreen from "@components/account/screens/FormScreen";

export default function UpdatePhone() {

    const { t } = useTranslation();

    return (

        <FormScreen
            backLabel={t("profile.title")}
            title={t("account.updatePhone.title")}
            description={t("account.updatePhone.description")}
            label={t("inputs.email")}
            placeholder={t("inputs.emailPlaceholder")}
            buttonText={t("button.sendCode")}
            nextScreen="VerifyUpdatePhone"
        />

    );

}