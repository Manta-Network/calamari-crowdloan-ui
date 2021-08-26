/* eslint-disable multiline-ternary */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import Contribution from '../../../types/Contribution';
import ContributionHistory from './ContributionHistory';
import ReferralHistory from './ReferralHistory';
import DetailsSummary from './DetailsSummary';

const CreateAccountPrompt = () => {
  const { t } = useTranslation();
  return (
    <div className="content-item p-8 xl:p-10 h-full mt-8 lg:mt-0 bg-white calamari-text details">
      <h1 className="title text-3xl md:text-4xl">{t('Your details')}</h1>
      <p className="mb-2 text-md xl:text-base">
        {t('Create an account in polkadot.js to continue')}
      </p>
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
  keyringIsInit
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

  if (!keyringIsInit) {
    return <InstallPJSPrompt />;
  } else if (!accountAddress) {
    return <CreateAccountPrompt />;
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

Details.propTypes = {
  userContributions: PropTypes.arrayOf(PropTypes.instanceOf(Contribution)),
  allContributions: PropTypes.arrayOf(PropTypes.instanceOf(Contribution)),
  allReferrals: PropTypes.object,
  accountAddress: PropTypes.string,
  allContributors: PropTypes.arrayOf(PropTypes.string),
  polkadotJSInstalled: PropTypes.bool,
  setAccountAddress: PropTypes.func,
  accountPair: PropTypes.object,
  keyringIsInit: PropTypes.bool
};

export default Details;
