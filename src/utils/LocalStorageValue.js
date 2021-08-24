const LANGUAGE_KEY = 'lang';

export const getLanguage = () => {
  return localStorage.getItem(LANGUAGE_KEY) ?? 'en';
};

export const setLanguage = (lang) => {
  localStorage.setItem(LANGUAGE_KEY, lang);
};
