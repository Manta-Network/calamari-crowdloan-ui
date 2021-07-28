import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Kusama from 'types/Kusama';
import config from 'config';
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

const DetailsSummary = ({
  userReferrals = [],
  allReferrals,
  userContributions,
  allContributions,
  accountAddress,
  allContributors
}) => {
  const [userBaseRewardsKMA, setUserBaseRewardsKMA] = useState(Calamari.zero());
  const [userBonusRewardsKMA, setUserBonusRewardsKMA] = useState(Calamari.zero());
  const [userGaveReferralRewardsKMA, setUserGaveReferralRewardsKMA] = useState(Calamari.zero());
  const [userWasReferredRewards, setUserWasReferredRewards] = useState(Calamari.zero());
  const [userTotalRewardsKMA, setUserTotalRewardKMA] = useState(Calamari.zero());
  const [userTotalContributionsKSM, setUserTotalContributionsKSM] = useState(Kusama.zero());

  const { t } = useTranslation();

  useEffect(() => {
    const getUserTotalContributionsKSM = () => {
      if (!userContributions) {
        return Calamari.zero();
      }
      const userTotalContributionsKSM = userContributions.reduce((acc, curr) => acc.add(curr.amountKSM), Kusama.zero());
      setUserTotalContributionsKSM(userTotalContributionsKSM);
    };
    getUserTotalContributionsKSM();
  }, [userContributions]);

  useEffect(() => {
    const getUserBaseRewardsKMA = () => {
      if (!userTotalContributionsKSM) {
        return Calamari.zero();
      }
      const userBaseRewards = userTotalContributionsKSM.toKMABaseReward();
      setUserBaseRewardsKMA(userBaseRewards);
    };
    getUserBaseRewardsKMA();
  }, [userTotalContributionsKSM]);

  useEffect(() => {
    const getUserBonusRewardsKMA = () => {
      if (!allContributions) {
        return Calamari.zero();
      } else if (allContributors.slice(0, config.EARLY_BONUS_TIER_1_CUTOFF).includes(accountAddress)) {
        return userContributions.reduce((acc, curr) => acc.add(curr.amountKSM.toKMABonusRewardTier1()), Calamari.zero());
      } else if (allContributors.slice(0, config.EARLY_BONUS_TIER_2_CUTOFF).includes(accountAddress)) {
        return userContributions.reduce((acc, curr) => acc.add(curr.amountKSM.toKMABonusRewardTier2()), Calamari.zero());
      } else {
        return Calamari.zero();
      }
    };
    setUserBonusRewardsKMA(getUserBonusRewardsKMA());
  }, [allContributions, allContributors, accountAddress, userContributions]);

  useEffect(() => {
    const getUserGaveReferralRewards = () => {
      if (!userReferrals) {
        return Calamari.zero();
      }
      return userReferrals.reduce((acc, curr) => acc.add(curr.amountKSM.toKMAGaveReferralReward()), Calamari.zero());
    };
    setUserGaveReferralRewardsKMA(getUserGaveReferralRewards());
  }, [userReferrals]);

  useEffect(() => {
    const getUserWasReferredRewards = () => {
      if (!allReferrals || !accountAddress || !userTotalContributionsKSM) {
        return Calamari.zero();
      } else if (allReferrals[accountAddress]) {
        return userTotalContributionsKSM.toKMAWasReferredReward();
      } else {
        return Calamari.zero();
      }
    };
    setUserWasReferredRewards(getUserWasReferredRewards());
  }, [allReferrals, accountAddress, userTotalContributionsKSM]);

  useEffect(() => {
    const getUserTotalRewardsKMA = () => {
      return userBaseRewardsKMA.add(userBonusRewardsKMA.add(userGaveReferralRewardsKMA.add(userWasReferredRewards)));
    };
    setUserTotalRewardKMA(getUserTotalRewardsKMA());
  }, [userBaseRewardsKMA, userBonusRewardsKMA, userGaveReferralRewardsKMA, userWasReferredRewards]);

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
          {userTotalRewardsKMA.toString()}
        </span>
      </div>
    </div>
  );
};

export default DetailsSummary;
