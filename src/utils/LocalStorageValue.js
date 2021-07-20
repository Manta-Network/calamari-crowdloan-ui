/* eslint-disable no-unneeded-ternary */
const LANGUAGE_KEY = 'lang';

export const getLanguage = () => {
  const lang = localStorage.getItem(LANGUAGE_KEY);
  return lang ? lang : 'en';
};

export const setLanguage = (lang) => {
  localStorage.setItem(LANGUAGE_KEY, lang);
};
