import React from "react";
import { useTranslation } from "react-i18next";


import FormScreen from "@components/account/screens/FormScreen";

export default function NewPhone() {

    const { t } = useTranslation();

    return (

        <FormScreen
            backLabel={t("profile.title")}
            title={t("account.updatePhone.title")}
            description={t("account.newPhone.description")}
            label={t("inputs.title.numero")}
            placeholder={t("inputs.numeroPlaceholder")}
            buttonText={t("button.update")}
            nextScreen="VerifyNewPhone"
            
        />

    );

}