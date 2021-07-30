const LANGUAGE_KEY = 'lang';
const LAST_ACCOUNT_KEY = 'lastAccount';

export const getLanguage = () => {
  const lang = localStorage.getItem(LANGUAGE_KEY);
  return lang || 'en';
};

export const setLanguage = (lang) => {
  localStorage.setItem(LANGUAGE_KEY, lang);
};

export const getLastAccessedAccount = () => {
  const lastAccount = localStorage.getItem(LAST_ACCOUNT_KEY);
  return lastAccount || null;
};

export const setLastAccessedAccount = lastAccount => {
  localStorage.setItem(LAST_ACCOUNT_KEY, lastAccount);
};
