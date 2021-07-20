import React, { useState, useEffect } from 'react';
import ArrowDown from 'assets/icons/arrow-down.svg';
import ArrowUp from 'assets/icons/arrow-up.svg';
/* eslint-disable multiline-ternary */
import React, { useState, useEffect } from 'react';
import ArrowDown from 'assets/icons/arrow-down.svg';
import ArrowUp from 'assets/icons/arrow-up.svg';
import { Placeholder } from 'semantic-ui-react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import Kusama from 'types/Kusama';
import Decimal from 'decimal.js';

const Details = ({ userContributions, allContributions, allReferrals, accountAddress }) => {
  const [userBaseRewardsKMA, setUserBaseRewardsKMA] = useState(new Decimal(0));
  const [userBonusRewardsKMA, setUserBonusRewardsKMA] = useState(new Decimal(0));
  const [userReferralRewardsKMA, setUserReferralRewardsKMA] = useState(new Decimal(0));
  const [userTotalRewardsKMA, setUserTotalRewardKMA] = useState(Decimal(0));
  const [userReferrals, setUserReferrals] = useState([]);
  const [userTotalContributionsKSM, setUserTotalContributionsKSM] = useState(new Kusama(Kusama.KSM, new Decimal(0)));

  const PAGE_SIZE = 5;
  const [currentPageNumberUserContributions, setCurrentPageNumberUserContributions] = useState(1);
  const totalPagesUserContributions = Math.max(Math.ceil(userContributions.length / 5, 1), 1);
  const currentPageUserContributions = userContributions.slice((currentPageNumberUserContributions - 1) * PAGE_SIZE, currentPageNumberUserContributions * PAGE_SIZE);

  const [currentPageNumberUserReferrals, setCurrentPageNumberUserReferrals] = useState(1);
  const totalPagesUserReferrals = Math.max(Math.ceil(userReferrals.length / 5, 1), 1);
  const currentPageUserReferrals = userReferrals.slice((currentPageNumberUserReferrals - 1) * PAGE_SIZE, currentPageNumberUserReferrals * PAGE_SIZE);

  const dateFormatOptions = { month: 'short', day: 'numeric' };

  const { t } = useTranslation();

  useEffect(() => {
    setTimeout(() => {
      setShowPlaceholder(false);
    }, 2000);
  }, []);

  useEffect(() => {
    const getUserReferrals = () => {
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
      setUserReferrals(userReferrals);
    };
    getUserReferrals();
  }, [allContributions, allReferrals, accountAddress]);

  useEffect(() => {
    const getUserBaseRewardsKMA = () => {
      const userBaseRewards = userContributions.reduce((acc, cur) => cur.amountKSM.value.mul(10000).add(acc), new Decimal(0));
      setUserBaseRewardsKMA(userBaseRewards);
    };
    getUserBaseRewardsKMA();
  }, [userContributions]);

  useEffect(() => {
    const getUserBonusRewardsKMA = () => {
      const KSMEligibleForBonus = new Kusama(Kusama.KSM, new Decimal(1000)); // todo: is this number correct??
      let runningTotalKSM = new Kusama(Kusama.KSM, new Decimal(0));
      let userBonusRewardKMA = new Decimal(0);
      allContributions.forEach(contribution => {
        if (contribution.address === accountAddress) {
          const KSMEligibleForBonusRemaining = KSMEligibleForBonus.minus(runningTotalKSM).max(new Kusama(Kusama.KSM, new Decimal(0)));
          const userKSMIneligibleForBonus = contribution.amountKSM.minus(KSMEligibleForBonusRemaining).max(new Kusama(Kusama.KSM, new Decimal(0)));
          const userKSMEligibleForBonus = contribution.amountKSM.minus(userKSMIneligibleForBonus);
          userBonusRewardKMA = userBonusRewardKMA.add(userKSMEligibleForBonus.value.mul(new Decimal(500)));
        }
        runningTotalKSM = runningTotalKSM.add(contribution.amountKSM);
      });
      setUserBonusRewardsKMA(userBonusRewardKMA);
    };
    getUserBonusRewardsKMA();
  }, [allContributions, accountAddress]);

  useEffect(() => {
    const getUserReferralRewards = () => {
      const userReferralRewardsKMA = userReferrals.reduce((acc, curr) => acc.add(curr.amountKSM.value).mul(500), new Decimal(0));
      setUserReferralRewardsKMA(userReferralRewardsKMA);
    };
    getUserReferralRewards();
  }, [userReferrals]);

  useEffect(() => {
    const getUserTotalRewardsKMA = () => {
      const userTotalRewardsKMA = userBaseRewardsKMA.add(userBonusRewardsKMA.add(userReferralRewardsKMA));
      setUserTotalRewardKMA(userTotalRewardsKMA);
    };
    getUserTotalRewardsKMA();
  }, [userBaseRewardsKMA, userBonusRewardsKMA, userReferralRewardsKMA]);

  useEffect(() => {
    const getUserTotalContributionsKSM = () => {
      const userTotalContributionsKSM = userContributions.reduce((acc, curr) => acc.add(curr.amountKSM), new Kusama(Kusama.KSM, new Decimal(0)));
      setUserTotalContributionsKSM(userTotalContributionsKSM);
    };
    getUserTotalContributionsKSM();
  }, [userContributions]);


  return (
    <div className="content-item p-8 xl:p-10 h-full mt-8 lg:mt-0 bg-white calamari-text details">
      <h1 className="title text-3xl md:text-4xl">{t('Your details')}</h1>
      <div className="flex">
        <div className="w-3/5">
          <p className="mb-0 pb-5">{t('Total contributions ')}</p>
          <span className="purple-text text-lg xl:text-2xl font-semibold">
            {userTotalContributionsKSM.toString()}
          </span>
        </div>
        <div className="w-2/5">
          <p className="mb-0 pb-5">{t('Total rewards ')}</p>
          <span className="purple-text text-lg xl:text-2xl font-semibold">
            {userTotalRewardsKMA.toString()} KMA
          </span>
        </div>
      </div>
      <div className="flex justify-between pt-6">
        <p className="mb-1">{t('Contribution history')}</p>
        <span className="opacity-50">{currentPageNumberUserContributions} of {totalPagesUserContributions}</span>
      </div>
      <div>
        <div className="artibute border-2 py-2 z-10 history relative rounded-lg calamari-text bg-white">
          {currentPageUserContributions.map((contribution, index) => (
            <div
              key={index}
              className={classNames(
                'flex text-lg justify-between pl-6 pr-10 py-2',
                { 'bg-gray': index % 2 }
              )}>
              <span>{contribution.date.toLocaleDateString('en-US', dateFormatOptions)}</span>
              <span className="font-semibold">{contribution.amountKSM.toString()}</span>
            </div>
          ))}
          <img
            src={ArrowUp}
            onClick={() =>
              currentPageNumberUserContributions > 1 && setCurrentPageNumberUserContributions(currentPageNumberUserContributions - 1)
            }
            alt="arrow-up"
            className="h-8 w-8 arrow-down absolute z-20 cursor-pointer top-0 p-2 mt-12 bg-white rounded-full"
          />
          <img
            src={ArrowDown}
            onClick={() =>
              currentPageNumberUserContributions < totalPagesUserContributions && setCurrentPageNumberUserContributions(currentPageNumberUserContributions + 1)
            }
            alt="arrow-down"
            className="h-8 w-8 arrow-down absolute cursor-pointer z-20 p-2 mb-12 bg-white rounded-full"
          />
        </div>
      </div>
      <div className="flex justify-between pt-10">
        <p className="mb-1">{t('Referral history')}</p>
        <span className="opacity-50">{currentPageNumberUserReferrals} of {totalPagesUserReferrals}</span>
      </div>
      <div>
        <div className="artibute border-2 z-10 history relative rounded-lg calamari-text bg-white">
          <div className='pt-2'>
            {currentPageUserReferrals.map((referral, index) => (

              <div
                key={index}
                className={classNames(
                  'flex text-lg justify-between pl-6 pr-10 py-2',
                  { 'bg-gray': index % 2 }
                )}>
                <span>{referral.date.toLocaleDateString('en-US', dateFormatOptions)}</span>
                <span className="font-semibold">{referral.amountKSM.toString()}</span>
              </div>
            ))
            }
          </div>
          <img
            src={ArrowDown}
            alt="arrow-down"
            className="h-8 w-8 arrow-down absolute cursor-pointer z-20 p-2 mb-12 bg-white rounded-full"
            onClick={() =>
              currentPageNumberUserReferrals < totalPagesUserReferrals && setCurrentPageNumberUserReferrals(currentPageNumberUserReferrals + 1)
            }
          />
          <img
            src={ArrowUp}
            alt="arrow-up"
            className="h-8 w-8 arrow-down absolute z-20 cursor-pointer top-0 p-2 mt-12 bg-white rounded-full"
            onClick={() =>
              currentPageNumberUserReferrals > 1 && setCurrentPageNumberUserReferrals(currentPageNumberUserReferrals - 1)
            }
          />
        </div>
      </div>
    </div>
  );
};

export default Details;
