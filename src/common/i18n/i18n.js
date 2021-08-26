import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import translationEN from 'common/locales/en.json';
import translationCN from 'common/locales/cn.json';
import translationRU from 'common/locales/ru.json';
import detector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: translationEN
  },
  cn: {
    translation: translationCN
  },
  ru: {
    translation: translationRU
  }
};

i18n
  .use(detector)
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    keySeparator: false,
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
