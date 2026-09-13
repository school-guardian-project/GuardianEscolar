import React from "react";
import { useTranslation } from "react-i18next";

import FormScreen from "@components/account/screens/FormScreen";

export default function NewEmail() {
    const { t } = useTranslation();
    const [value, setValue] = React.useState("");
    return (
        <FormScreen
            backLabel={t("profile.title")}
            title={t("account.updateEmail.title")}
            description={t("account.verify.description")}
            label={t("inputs.email")}
            placeholder={t("inputs.emailPlaceholder")}
            buttonText={t("button.update")}
            nextScreen="VerifyNewEmail"
            value={value}
            onChangeText={(v) => { setValue(v); const { pendingProfile } = require("@core/api/profileUpdate.service"); pendingProfile.setEmail(v); }}
        />
    );

}