import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import es from './es.json';
import en from './en.json';
import fr from './fr.json';
import pt from './pt.json';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      es: { translation: es },
      en: { translation: en },
      fr: { translation: fr },
      pt: { translation: pt },
    },
    lng: 'es',           // idioma por defecto
    fallbackLng: 'es',   // si falta una key usa español
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;