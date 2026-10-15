import React from "react";

import FormScreen from "@components/account/screens/FormScreen";
import { requestPasswordReset } from "@core/services/forgotInformationService";

import { useTranslation } from "react-i18next";

export default function ForgotPassword(){

    const {t}=useTranslation();

    return(

        <FormScreen
            title={t("forgotPassword.title")}
            description={t("forgotPassword.description")}
            label={t("inputs.email")}
            placeholder={t("forgotPassword.emailPlaceholder")}
            buttonText={t("button.sendCode")}
            nextScreen="VerifyCode"
            inputType="email"
            onSubmit={requestPasswordReset}

        />

    );

}