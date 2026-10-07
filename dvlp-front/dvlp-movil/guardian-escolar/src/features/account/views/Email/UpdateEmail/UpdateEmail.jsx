import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { getSession } from "@core/services/authService";
import { requestEmailChange } from "@core/services/forgotInformationService";
import FormScreen from "@components/account/screens/FormScreen";

export default function UpdateEmail() {

    const { t } = useTranslation();
    const [email, setEmail] = useState("");

    useEffect(() => {
        getSession().then((session) => setEmail(session?.email ?? ""));
    }, []);

    return (

        <FormScreen
            backLabel={t("profile.title")}
            title={t("account.updateEmail.title")}
            description={t("account.updateEmail.description")}
            label={t("inputs.email")}
            placeholder={t("inputs.emailPlaceholder")}
            buttonText={t("button.sendCode")}
            nextScreen="VerifyUpdateEmail"
            inputType="email"
            initialValue={email}
            editable={false}
            onSubmit={requestEmailChange}
        />

    );

}