import React from "react";
import { useTranslation } from "react-i18next";

import FormScreen from "@components/account/screens/FormScreen";
import { submitNewEmail } from "@core/services/forgotInformationService";

export default function NewEmail() {

    const { t } = useTranslation();

    return (

        <FormScreen
            backLabel={t("profile.title")}
            title={t("account.updateEmail.title")}
            description={t("account.verify.description")}
            label={t("inputs.email")}
            placeholder={t("inputs.emailPlaceholder")}
            buttonText={t("button.update")}
            nextScreen="VerifyNewEmail"
            inputType="email"
            errorContext="emailFlow"
            onSubmit={submitNewEmail}
        />

    );

}