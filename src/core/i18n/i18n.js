import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";

import es from "./es.json";
import en from "./en.json";
import fr from "./fr.json";
import pt from "./pt.json";

const LANGUAGE_KEY = "@guardian_escolar_language";

const resources = {
    es: {
        translation: es,
    },
    en: {
        translation: en,
    },
    fr: {
        translation: fr,
    },
    pt: {
        translation: pt,
    },
};

i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: "es",
        fallbackLng: "es",
        interpolation: {
            escapeValue: false,
        },
    });

export const loadLanguage = async () => {
    try {
        const savedLanguage = await AsyncStorage.getItem(LANGUAGE_KEY);

        if (savedLanguage && resources[savedLanguage]) {
            await i18n.changeLanguage(savedLanguage);
        }
    } catch (error) {
        console.log("Error cargando idioma:", error);
    }
};

export const changeLanguage = async (language) => {
    try {
        await i18n.changeLanguage(language);

        await AsyncStorage.setItem(
            LANGUAGE_KEY,
            language
        );
    } catch (error) {
        console.log("Error guardando idioma:", error);
    }
};

export default i18n;