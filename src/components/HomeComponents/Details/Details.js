/* eslint-disable multiline-ternary */
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import ContributionHistory from './ContributionHistory';
import ReferralHistory from './ReferralHistory';
import DetailsSummary from './DetailsSummary';
import AccountSelectModal from '../../Layouts/AccountSelectModal';

const ConnectWalletPrompt = ({ setAccountAddress, accountPair }) => {
  const { t } = useTranslation();
  const [openModal, setOpenModal] = useState(false);

  return (
    <div className="content-item p-8 xl:p-10 h-full mt-8 lg:mt-0 bg-white calamari-text details">
    <h1 className="title text-3xl md:text-4xl">{t('Your details')}</h1>
    <div onClick={() => setOpenModal(true)} >
      <a href='#' className="mb-2 text-md xl:text-base">
        {t('Connect wallet to continue')}
      </a>
    </div>
    {
      openModal &&
      <AccountSelectModal
        openModal={openModal}
        setOpenModal={setOpenModal}
        setAccountAddress={setAccountAddress}
        accountPair={accountPair}
      />
    }
    </div>
  );
};

const InstallPJSPrompt = () => {
  const { t } = useTranslation();
  return (
    <div className="content-item p-8 xl:p-10 h-full mt-8 lg:mt-0 bg-white calamari-text details">
    <h1 className="title text-3xl md:text-4xl">{t('Your details')}</h1>
    <a className="mb-2 text-md xl:text-base" href='https://polkadot.js.org/extension/'>
    {t('Install polkadot.js wallet to continue')}
    </a>
    </div>
  );
};

const Details = ({
  userContributions,
  allContributions,
  allReferrals,
  accountAddress,
  allContributors,
  polkadotJSInstalled,
  setAccountAddress,
  accountPair
}) => {
  const [userReferrals, setUserReferrals] = useState([]);
  const { t } = useTranslation();

  useEffect(() => {
    const getUserReferrals = () => {
      if (!allReferrals || !allContributions || !accountAddress) {
        setUserReferrals(null);
        return;
      }
      const referredByUser = [];
      for (const [referred, referredBy] of Object.entries(allReferrals)) {
        if (referredBy === accountAddress) {
          referredByUser.push(referred);
        }
      }
      const userReferrals = [];
      allContributions.forEach(contribution => {
        if (referredByUser.includes(contribution.address)) {
          userReferrals.push(contribution);
        }
      });
      setUserReferrals(userReferrals.sort((a, b) => b.date - a.date));
    };
    getUserReferrals();
  }, [allContributions, allReferrals, accountAddress]);

  if (!polkadotJSInstalled) {
    return <InstallPJSPrompt />;
  } else if (!accountAddress) {
    return <ConnectWalletPrompt setAccountAddress={setAccountAddress} accountPair={accountPair} />;
  }
  return (
    <div className="content-item p-8 xl:p-10 h-full mt-8 lg:mt-0 bg-white calamari-text details">
      <h1 className="title text-3xl md:text-4xl">{t('Your details')}</h1>
      <DetailsSummary
        userReferrals={userReferrals || []}
        userContributions={userContributions}
        allContributions={allContributions}
        allReferrals={allReferrals}
        accountAddress={accountAddress}
        allContributors={allContributors}
      />
      <ContributionHistory userContributions={userContributions} />
      <ReferralHistory userReferrals={userReferrals} />
    </div>
  );
};

export default Details;
