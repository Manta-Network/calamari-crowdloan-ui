import React from 'react';
import { Line } from 'react-chartjs-2';
import Kusama from 'types/Kusama';
import Decimal from 'decimal.js';

const graphData = {
  labels: [],
  datasets: [
    {
      label: 'KSM',
      data: [],
      borderColor: 'rgba(233, 109, 43, 1)',
      backgroundColor: 'rgba(233, 109, 43, 1)',
      yAxisID: 'y',
      borderWidth: 1
    }
  ]
};

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

function Crowdloan ({ totalFundsRaisedKSM, contributionsByDay }) {
  const getTotalRewards = () => {
    let earlyBonus = totalFundsRaisedKSM.value.mul(500);
    if (totalFundsRaisedKSM.value.gt(1000)) {
      earlyBonus = 500000;
    }
    return totalFundsRaisedKSM.value.mul(10000).add(earlyBonus);
  };
  // console.log(totalFundsRaisedKSM, '!!');
  const totalRewards = getTotalRewards();

  // console.log(contributionsByDay.toString(), '')

  const graphData = {
    labels: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p'],
    datasets: [
      {
        label: 'KSM',
        data: contributionsByDay?.map(
          (_, i) => contributionsByDay.slice(0, i)
            .reduce((acc, cur) => acc.add(cur), new Kusama(Kusama.KSM, new Decimal(0))))
          .map(kusama => kusama.value.toNumber()),
        borderColor: 'rgba(233, 109, 43, 1)',
        backgroundColor: 'rgba(233, 109, 43, 1)',
        yAxisID: 'y',
        borderWidth: 1
      }
    ]
  };

  console.log(graphData);

  return (
    <div className="content-item p-8 xl:p-10 h-full mt-16 lg:mt-0 bg-white calamari-text crowdloan">
      <h1 className="title text-3xl md:text-4xl">The Crowdloan</h1>
      <div className="py-4 relative graph-line pt-4">
        <span className="absolute left-0">KSM</span>
        <span className="absolute right-0">KMA</span>
        <Line data={graphData} options={options} />
      </div>
      <div className="pt-6 flex justify-between">
        <p className="mb-0 calamari-text pb-5">Total Contributions</p>
        <span className="purple-text text-lg xl:text-2xl font-semibold">
          {totalFundsRaisedKSM.toString()}
        </span>
      </div>
      <div className="pt-3 flex justify-between">
        <p className="mb-0 calamari-text pb-5">Total Rewards</p>
        <span className="purple-text text-lg xl:text-2xl font-semibold">
          {totalRewards.toNumber().toLocaleString(undefined, { maximumFractionDigits: 0, minimumFractionDigits: 0 })} KMA
        </span>
      </div>
    </div>
  );
}

export default Crowdloan;
