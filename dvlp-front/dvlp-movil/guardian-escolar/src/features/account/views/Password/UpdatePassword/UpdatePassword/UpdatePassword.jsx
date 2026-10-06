import React from "react";

import FormScreen from "@components/account/screens/FormScreen";

import { useTranslation } from "react-i18next";

export default function UpdatePassword(){

    const {t}=useTranslation();

    return(

        <FormScreen
            title={t("account.updatePassword.title")}
            description={t("account.updateEmail.description")}
            label={t("inputs.email")}
            placeholder={t("inputs.emailPlaceholder")}
            buttonText={t("button.verifyCode")}
            nextScreen="VerifyCodePassword"

        />

    );

}