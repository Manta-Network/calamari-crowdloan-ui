/* eslint-disable multiline-ternary */
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import ContributionHistory from './ContributionHistory';
import ReferralHistory from './ReferralHistory';
import DetailsSummary from './DetailsSummary';

const ConnectWalletPrompt = () => {
  const { t } = useTranslation();
  return (
    <div className="content-item p-8 xl:p-10 h-full mt-8 lg:mt-0 bg-white calamari-text details">
    <h1 className="title text-3xl md:text-4xl">{t('Your details')}</h1>
    <p className="mb-2 text-sm xl:text-base">
      {t('Connect wallet to continue')}
    </p>
    </div>
  );
};

const Details = ({
  userContributions,
  allContributions,
  allReferrals,
  accountAddress,
  allContributors
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

  if (!accountAddress) {
    return <ConnectWalletPrompt/>;
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
