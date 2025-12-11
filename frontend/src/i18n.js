// src/i18n.js (or wherever)
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import HttpBackend from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";

const basePath = import.meta.env.BASE_URL || "/";

i18n
  .use(HttpBackend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "en",
    debug: false,

    backend: {
      loadPath: `${basePath}locales/{{lng}}/{{ns}}.json`,
    },

    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
