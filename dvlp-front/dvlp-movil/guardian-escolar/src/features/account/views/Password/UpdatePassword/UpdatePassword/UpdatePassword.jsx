import React, { useEffect, useState } from "react";
import FormScreen from "@components/account/screens/FormScreen";
import { getSession } from "@core/services/authService";
import { requestPasswordReset } from "@core/services/forgotInformationService";

import { useTranslation } from "react-i18next";

export default function UpdatePassword(){

    const {t}=useTranslation();
    const [email, setEmail] = useState("");

    useEffect(() => {
        getSession().then((session) => setEmail(session?.email ?? ""));
    }, []);

    return(

        <FormScreen
            title={t("account.updatePassword.title")}
            description={t("account.updateEmail.description")}
            label={t("inputs.email")}
            placeholder={t("inputs.emailPlaceholder")}
            buttonText={t("button.verifyCode")}
            nextScreen="VerifyCodePassword"
            inputType="email"
            initialValue={email}
            editable={false}
            onSubmit={(value) => requestPasswordReset(value, true)}

        />

    );

}