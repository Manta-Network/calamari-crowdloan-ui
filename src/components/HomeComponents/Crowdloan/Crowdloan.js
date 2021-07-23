/* eslint-disable multiline-ternary */
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Placeholder } from 'semantic-ui-react';
import Graph from './Graph';
import Leaderboard from './Leaderboard';

function Crowdloan ({ totalContributionsKSM, allContributions }) {
  const { t } = useTranslation();

  // todo: include referrals
  const getTotalRewards = () => {
    if (!totalContributionsKSM) {
      return;
    }
    let earlyBonus = totalContributionsKSM.value.mul(500);
    if (totalContributionsKSM.value.gt(1000)) {
      earlyBonus = 500000;
    }
    return totalContributionsKSM.value.mul(10000).add(earlyBonus);
  };
  const totalRewards = getTotalRewards();

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
              {totalRewards.toNumber().toLocaleString(undefined, { maximumFractionDigits: 0, minimumFractionDigits: 0 })} KMA
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
