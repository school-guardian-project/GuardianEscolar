import React from "react";
import { useTranslation } from "react-i18next";
import { Text } from "react-native";

import FormScreen from "@components/account/screens/FormScreen";

const EMAIL_REGEX = /^[a-z0-9._%+-]+@[a-z0-9-]+(\.[a-z0-9-]+)*\.[a-z]{2,}$/i;

export default function NewEmail() {
    const { t } = useTranslation();
    const [value, setValue] = React.useState("");
    const [error, setError] = React.useState(null);

    const handleChange = (v) => {
        setValue(v);
        setError(null);
        const { pendingProfile } = require("@core/api/profileUpdate.service");
        pendingProfile.setEmail(v);
    };

    const handleSubmit = (navigation) => {
        if (!value) {
            setError("El correo es requerido.");
            return;
        }
        if (!EMAIL_REGEX.test(value)) {
            setError("Formato de correo inválido. Ejemplo: usuario@dominio.com");
            return;
        }
        setError(null);
        navigation.navigate("VerifyNewEmail");
    };

    return (
        <>
            <FormScreen
                backLabel={t("profile.title")}
                title={t("account.updateEmail.title")}
                description={t("account.verify.description")}
                label={t("inputs.email")}
                placeholder="correo@dominio.com"
                buttonText={t("button.update")}
                value={value}
                onChangeText={handleChange}
                onSubmit={handleSubmit}
            />
            {error ? (
                <Text style={{ color: "#d32f2f", fontSize: 12, marginTop: -8, marginBottom: 8, paddingHorizontal: 16 }}>{error}</Text>
            ) : null}
        </>
    );
}