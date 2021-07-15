import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
import FakeData from 'pages/FakeData';
import { useSubstrate } from '../../substrate-lib';

const options = {
  responsive: true,
  interaction: {
    mode: 'index',
    intersect: false
  },
  stacked: false,
  plugins: {
    legend: {
      display: false
    }
  },
  scales: {
    y: {
      type: 'linear',
      display: true,
      position: 'right'
    }
  },
  elements: { point: { radius: 1, hoverRadius: 2 } }
};

function Crowdloan ({ totalFundsRaisedKSM }) {
  const getTotalRewards = () => {
    let earlyBonus = 500 * totalFundsRaisedKSM;
    if (totalFundsRaisedKSM > 1000) {
      earlyBonus = 500000;
    }
    return totalFundsRaisedKSM * 10000 + earlyBonus;
  };
  const totalRewards = getTotalRewards();

  return (
    <div className="content-item p-8 xl:p-10 h-full mt-16 lg:mt-0 bg-white calamari-text crowdloan">
      <h1 className="title text-3xl md:text-4xl">The Crowdloan</h1>
      <div className="py-4 relative graph-line pt-4">
        <span className="absolute left-0">KSM</span>
        <span className="absolute right-0">KMA</span>
        <Line data={FakeData.graphData} options={options} />
      </div>
      <div className="pt-6 flex justify-between">
        <p className="mb-0 calamari-text pb-5">Total Contributions</p>
        <span className="purple-text text-lg xl:text-2xl font-semibold">
          {totalFundsRaisedKSM} KSM
        </span>
      </div>
      <div className="pt-3 flex justify-between">
        <p className="mb-0 calamari-text pb-5">Total Rewards</p>
        <span className="purple-text text-lg xl:text-2xl font-semibold">
          {totalRewards} KMA
        </span>
      </div>
    </div>
  );
}

export default Crowdloan;
