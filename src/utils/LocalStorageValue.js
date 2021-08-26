const LANGUAGE_KEY = 'lang';
const LAST_ACCOUNT_KEY = 'lastAccount';

export const getLanguage = () => {
  return localStorage.getItem(LANGUAGE_KEY) ?? 'en';
};

export const setLanguage = (lang) => {
  localStorage.setItem(LANGUAGE_KEY, lang);
};

export const getLastAccessedAccount = keyring => {
  const lastAccount = localStorage.getItem(LAST_ACCOUNT_KEY);
  if (!lastAccount) {
    return null;
  }
  // Validate that account is still in user's keychain
  try {
    keyring.getPair(lastAccount);
    return lastAccount;
  } catch (error) {
    return null;
  }
};

export const setLastAccessedAccount = lastAccount => {
  localStorage.setItem(LAST_ACCOUNT_KEY, lastAccount);
};
