import ReferralCode from 'types/ReferralCode';

const LANGUAGE_KEY = 'lang';
const LAST_ACCOUNT_KEY = 'lastAccount';
const LATEST_REFERRAL_KEY = 'lastestReferral';

export const getLanguage = () => {
  return localStorage.getItem(LANGUAGE_KEY) ?? 'en';
};

export const setLanguage = (lang) => {
  localStorage.setItem(LANGUAGE_KEY, lang);
};

export const getLastAccessedAccount = (keyring) => {
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

export const setLastAccessedAccount = (lastAccount) => {
  localStorage.setItem(LAST_ACCOUNT_KEY, lastAccount);
};

export const getLatestReferralCode = (address) => {
  const referralString =
    localStorage.getItem(`${LATEST_REFERRAL_KEY}_${address}`) ?? null;
  return referralString ? ReferralCode.fromHexStr(referralString) : null;
};

export const setLatestReferralCode = (referralCode, address) => {
  localStorage.setItem(
    `${LATEST_REFERRAL_KEY}_${address}`,
    referralCode.toString(),
  );
};
