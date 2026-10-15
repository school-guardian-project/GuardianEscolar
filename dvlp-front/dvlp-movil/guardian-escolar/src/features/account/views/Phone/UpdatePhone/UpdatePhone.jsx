import React from "react";
import { useTranslation } from "react-i18next";

import FormScreen from "@components/account/screens/FormScreen";
import { getProfile } from "@core/services/profileService";
import { getSession } from "@core/services/authService";
import { requestPhoneChange } from "@core/services/forgotInformationService";

export default function UpdatePhone() {

    const { t } = useTranslation();

    return (

        <FormScreen
            backLabel={t("profile.title")}
            title={t("account.updatePhone.title")}
            description={t("account.updatePhone.description")}
            label={t("account.updatePhone.currentPhone")}
            placeholder={t("account.updatePhone.currentPhonePlaceholder")}
            buttonText={t("button.sendCode")}
            nextScreen="VerifyUpdatePhone"
            inputType="phone"
            onSubmit={async (phone) => {
                const session = await getSession();
                const email = session?.email ?? (await getProfile())?.email;
                if (!email) throw new Error("No se encontró el correo de la sesión.");
                await requestPhoneChange(email, phone);
            }}
        />

    );

}