/* eslint-disable multiline-ternary */
import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import Kusama from 'types/Kusama';
import Decimal from 'decimal.js';
import FakeData from 'pages/FakeData';
import { Placeholder } from 'semantic-ui-react';
import TableColumnHeader from 'components/Table/TableColumnHeader';
import TableHeaderWrapper from 'components/Table/TableHeaderWrapper';
import TableRow from 'components/Table/TableRow';
import TableRowItem from 'components/Table/TableRowItem';
import config from '../../config';

const options = {
  animation: false,
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

function Crowdloan({ totalFundsRaisedKSM, contributionsByDay }) {
  const [showPlaceholder, setShowPlaceholder] = useState(true);
  const dateFormatOptions = { month: 'short', day: 'numeric' };

  console.log(contributionsByDay, '!')

  useEffect(() => {
    setTimeout(() => {
      setShowPlaceholder(false);
    }, 2000);
  }, []);

  const getTotalRewards = () => {
    let earlyBonus = totalFundsRaisedKSM.value.mul(500);
    if (totalFundsRaisedKSM.value.gt(1000)) {
      earlyBonus = 500000;
    }
    return totalFundsRaisedKSM.value.mul(10000).add(earlyBonus);
  };
  const totalRewards = getTotalRewards();

  const graphData = {
    labels: contributionsByDay?.map(
      (_, i) => {
        let date = new Date(config.CROWDLOAN_START_TIMESTAMP)
        date.setDate(date.getDate() + i + 1)
        return date.toLocaleDateString('en-US', dateFormatOptions)
      }),
    datasets: [
      {
        label: 'KSM',
        data: contributionsByDay?.map(
          (_, i) => contributionsByDay.slice(0, i + 1)
            .reduce((acc, cur) => acc.add(cur), new Kusama(Kusama.KSM, new Decimal(0))))
          .map(kusama => kusama.value.toNumber()),
        borderColor: 'rgba(233, 109, 43, 1)',
        backgroundColor: 'rgba(233, 109, 43, 1)',
        yAxisID: 'y',
        borderWidth: 1
      }
    ]
  };

  console.log(graphData.labels)

  return (
    <div className="content-item h-full mt-16 lg:mt-0 calamari-text crowdloan">
      <div className="bg-white item p-8 xl:p-10 xl:pb-4">
        <h1 className="title text-3xl md:text-4xl">The Crowdloan</h1>
      <div className="py-4 relative graph-line pt-1">
      <div className="pt- flex justify-between">
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
        {showPlaceholder ? (
          <div className="py-8">
            <Placeholder fluid>
              <Placeholder.Paragraph>
                <Placeholder.Line />
                <Placeholder.Line />
                <Placeholder.Line />
                <Placeholder.Line />
              </Placeholder.Paragraph>
              <Placeholder.Paragraph>
                <Placeholder.Line />
                <Placeholder.Line />
                <Placeholder.Line />
              </Placeholder.Paragraph>
            </Placeholder>
          </div>
        ) : (
          <div className="py-4 relative graph-line pt-4">
            <span className="absolute right-0">KSM</span>
            <Line data={graphData} options={options} />
          </div>
        )}
      </div>
      </div>
      <div className="item p-8 mt-6 xl:px-10 xl:py-6 bg-white">
        <h1 className="title text-3xl md:text-4xl">Leaderboard</h1>
        <div className="overflow-x-auto border-2 rounded-lg">
          <div className="min-w-table-md ">
            <TableHeaderWrapper className="px-2">
              <TableColumnHeader label="Rank" width="15%" />
              <TableColumnHeader label="Address" width="30%" />
              <TableColumnHeader label="KSM" width="25%" />
              <TableColumnHeader label="Reward(KMA)" width="30%" />
            </TableHeaderWrapper>
            {FakeData.leaderBoardData.map((val) => (
              <TableRow className="bg-light-gray calamari-text rounded-lg px-2 my-2">
                <TableRowItem width="15%">
                  <div className="w-8 h-8 bg-purple text-white leading-8 text-center rounded-md">
                    {val.rank}
                  </div>
                </TableRowItem>
                <TableRowItem width="30%">
                  <div
                    style={{ textOverflow: 'ellipsis' }}
                    className="overflow-hidden">
                    {val.address}
                  </div>
                </TableRowItem>
                <TableRowItem width="25%">
                  <span className="text-thirdry font-semibold">
                    {val.amount}
                  </span>
                </TableRowItem>
                <TableRowItem width="30%">
                  <span className="manta-prime-blue font-semibold">
                    {val.reward}
                  </span>
                </TableRowItem>
              </TableRow>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Crowdloan;
