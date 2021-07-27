/* eslint-disable multiline-ternary */
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Placeholder } from 'semantic-ui-react';
import Calamari from 'types/Calamari';
import Graph from './Graph';
import Leaderboard from './Leaderboard';
import config from 'config';

function Crowdloan ({ totalContributionsKSM, allContributions, allContributors, allReferrals }) {
  const { t } = useTranslation();

  const [totalBaseRewardsKMA, setTotalBaseRewardsKMA] = useState(Calamari.zero());
  const [totalBonusRewardsKMA, setTotalBonusRewardsKMA] = useState(Calamari.zero());
  const [totalReferralRewardsKMA, setTotalReferralRewardsKMA] = useState(Calamari.zero());
  const [totalRewardsKMA, setTotalRewardsKMA] = useState(Calamari.zero());

  useEffect(() => {
    const getTotalBaseRewardsKMA = () => {
      if (!totalContributionsKSM) {
        return Calamari.zero();
      }
      return totalContributionsKSM.toKMABaseReward();
    };
    setTotalBaseRewardsKMA(getTotalBaseRewardsKMA());
  }, [totalContributionsKSM]);

  useEffect(() => {
    const getTotalBonusRewardsKMA = () => {
      if (!allContributions) {
        return Calamari.zero();
      }
      return allContributions.reduce((acc, contribution) => {
        if (allContributors.slice(0, config.EARLY_BONUS_TIER_1_CUTOFF).includes(contribution.address)) {
          return acc.add(contribution.amountKSM.toKMABonusRewardTier1());
        } else if (allContributors.slice(0, config.EARLY_BONUS_TIER_2_CUTOFF).includes(contribution.address)) {
          return acc.add(contribution.amountKSM.toKMABonusRewardTier2());
        } else {
          return acc;
        }
      }, Calamari.zero());
    };
    setTotalBonusRewardsKMA(getTotalBonusRewardsKMA());
  }, [allContributions, allContributors]);

  useEffect(() => {
    const getTotalReferralRewardsKMA = () => {
      if (!allContributions || !allReferrals) {
        return Calamari.zero();
      }
      return allContributions.reduce((acc, contribution) => {
        if (allReferrals[contribution.address]) {
          const giveReferralReward = contribution.amountKSM.toKMAGaveReferralReward();
          const receiveReferralReward = contribution.amountKSM.toKMAWasReferredReward();
          const referralReward = giveReferralReward.add(receiveReferralReward);
          return acc.add(referralReward);
        } else {
          return acc;
        }
      }, Calamari.zero());
    };
    setTotalReferralRewardsKMA(getTotalReferralRewardsKMA());
  }, [allContributions, allReferrals]);

  useEffect(() => {
    const getTotalRewardsKMA = () => {
      return totalBaseRewardsKMA.add(totalBonusRewardsKMA.add(totalReferralRewardsKMA));
    };
    setTotalRewardsKMA(getTotalRewardsKMA());
  }, [totalBaseRewardsKMA, totalBonusRewardsKMA, totalReferralRewardsKMA]);

  return (
    <div className="content-item lg:flex flex-col h-full mt-16 lg:mt-0 calamari-text crowdloan">
      <div className="bg-white item p-8 xl:p-10 xl:pb-4">
        <h1 className="title text-3xl md:text-4xl">{t('The Crowdloan')}</h1>
        {!totalContributionsKSM ? (
          <div className="py-2">
            <Placeholder fluid>
              <Placeholder.Line />
              <Placeholder.Line />
            </Placeholder>
          </div>
        ) : (
          <div className="flex">
            <div className="w-3/5">
              <p className="mb-0 pb-5 total-title">
                {t('Total contributions')}
              </p>
              <span className="purple-text total-value text-lg font-semibold">
                {totalContributionsKSM.toString()}
              </span>
            </div>
            <div className="w-2/5">
              <p className="mb-0 pb-5 total-title">{t('Total rewards')}</p>
              <span className="purple-text total-value text-lg font-semibold">
                {totalRewardsKMA.toString()}
              </span>
            </div>
          </div>
        )}
        <Graph allContributions={allContributions} />
      </div>
      <Leaderboard allContributions={allContributions} />
    </div>
  );
}

export default Crowdloan;
