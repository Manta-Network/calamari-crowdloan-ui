import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Kusama from 'types/Kusama';
import Decimal from 'decimal.js';
import Calamari from 'types/Calamari';
import { Placeholder } from 'semantic-ui-react';

const DetailsSummaryPlaceholder = () => {
  return (
    <div className="py-2">
      <Placeholder fluid>
        <Placeholder.Line />
        <Placeholder.Line />
      </Placeholder>
    </div>
  );
};

const DetailsSummary = ({ userReferrals = [], userContributions, allContributions, accountAddress }) => {
  const [userBaseRewardsKMA, setUserBaseRewardsKMA] = useState(Calamari.zero());
  const [userBonusRewardsKMA, setUserBonusRewardsKMA] = useState(Calamari.zero());
  const [userReferralRewardsKMA, setUserReferralRewardsKMA] = useState(Calamari.zero());
  const [userTotalRewardsKMA, setUserTotalRewardKMA] = useState(Calamari.zero());
  const [userTotalContributionsKSM, setUserTotalContributionsKSM] = useState(Kusama.zero());

  const { t } = useTranslation();
  useEffect(() => {
    const getUserBaseRewardsKMA = () => {
      if (!userContributions) {
        return;
      }
      const userBaseRewards = userContributions.reduce((acc, cur) => cur.amountKSM.toKMABaseReward().add(acc), Calamari.zero());
      setUserBaseRewardsKMA(userBaseRewards);
    };
    getUserBaseRewardsKMA();
  }, [userContributions]);

  useEffect(() => {
    const getUserBonusRewardsKMA = () => {
      if (!allContributions) {
        return new Calamari(new Decimal(0));
      }

      const KSMEligibleForBonus = new Kusama(Kusama.KSM, new Decimal(1000)); // todo: is this number correct??
      let runningTotalKSM = Kusama.zero();
      let userBonusRewardKMA = Calamari.zero();
      allContributions.forEach(contribution => {
        if (contribution.address === accountAddress) {
          const KSMEligibleForBonusRemaining = KSMEligibleForBonus.minus(runningTotalKSM).max(Kusama.zero());
          const userKSMIneligibleForBonus = contribution.amountKSM.minus(KSMEligibleForBonusRemaining).max(Kusama.zero());
          const userKSMEligibleForBonus = contribution.amountKSM.minus(userKSMIneligibleForBonus);

          userBonusRewardKMA = userBonusRewardKMA.add(userKSMEligibleForBonus.toKMABonusReward());
        }
        runningTotalKSM = runningTotalKSM.add(contribution.amountKSM);
      });
      setUserBonusRewardsKMA(userBonusRewardKMA);
    };
    getUserBonusRewardsKMA();
  }, [allContributions, accountAddress]);

  useEffect(() => {
    const getUserReferralRewards = () => {
      const userReferralRewardsKMA = userReferrals.reduce((acc, curr) => acc.add(curr.amountKSM.toKMAReferralReward()), Calamari.zero());
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
      if (!userContributions) {
        return;
      }
      const userTotalContributionsKSM = userContributions.reduce((acc, curr) => acc.add(curr.amountKSM), Kusama.zero());
      setUserTotalContributionsKSM(userTotalContributionsKSM);
    };
    getUserTotalContributionsKSM();
  }, [userContributions]);

  if (!userContributions) {
    return <DetailsSummaryPlaceholder />;
  }
  return (
    <div className="flex">
      <div className="w-3/5">
        <p className="mb-0 pb-5">{t('Total contributions ')}</p>
        <span className="purple-text text-lg xl:text-xl font-semibold">
          {userTotalContributionsKSM.toString()}
        </span>
      </div>
      <div className="w-2/5">
        <p className="mb-0 pb-5">{t('Total rewards ')}</p>
        <span className="purple-text text-lg xl:text-xl font-semibold">
          {userTotalRewardsKMA.toString()} KMA
        </span>
      </div>
    </div>
  );
};

export default DetailsSummary;
