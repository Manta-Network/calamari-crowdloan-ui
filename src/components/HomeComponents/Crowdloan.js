/* eslint-disable multiline-ternary */
import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import FakeData from 'pages/FakeData';
import { useTranslation } from 'react-i18next';
import { Placeholder } from 'semantic-ui-react';
import TableColumnHeader from 'components/Table/TableColumnHeader';
import TableHeaderWrapper from 'components/Table/TableHeaderWrapper';
import TableRow from 'components/Table/TableRow';
import TableRowItem from 'components/Table/TableRowItem';

const options = {
  responsive: true,
  interaction: {
    mode: 'index',
    intersect: false,
  },
  stacked: false,
  plugins: {
    legend: {
      display: false,
    },
  },
  scales: {
    y: {
      type: 'linear',
      display: true,
      position: 'left',
    },
    y1: {
      type: 'linear',
      display: true,
      position: 'right',
    },
  },
};

const Crowdloan = () => {
  const { t } = useTranslation();
  const [showPlaceholder, setShowPlaceholder] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setShowPlaceholder(false);
    }, 2000);
  }, []);

  return (
    <div className="content-item h-full mt-16 lg:mt-0 calamari-text crowdloan">
      <div className="bg-white item p-8 xl:p-10 xl:pb-4">
        <h1 className="title text-3xl md:text-4xl">{t('The Crowdloan')}</h1>
        {showPlaceholder ? (
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
                45,200 KSM
              </span>
            </div>
            <div className="w-2/5">
              <p className="mb-0 pb-5 total-title">{t('Total rewards')}</p>
              <span className="purple-text total-value text-lg font-semibold">
                15,450,000 KMA
              </span>
            </div>
          </div>
        )}
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
                <Placeholder.Line />
              </Placeholder.Paragraph>
            </Placeholder>
          </div>
        ) : (
          <div className="py-4 relative graph-line pt-4">
            <span className="absolute left-0">KSM</span>
            <span className="absolute right-0">KMA</span>
            <Line height={140} data={FakeData.graphData} options={options} />
          </div>
        )}
      </div>
      <div className="item p-8 mt-6 xl:px-10 xl:py-6 bg-white">
        <h1 className="title text-3xl md:text-4xl">{t('Leaderboard')}</h1>
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
          <div className="overflow-x-auto border-2 rounded-lg">
            <div className="min-w-table-md ">
              <TableHeaderWrapper className="px-2">
                <TableColumnHeader label={t('Rank')} width="15%" />
                <TableColumnHeader label={t('Address')} width="30%" />
                <TableColumnHeader label={t('Amount (KSM)')} width="25%" />
                <TableColumnHeader label={t('Rewards (KMA)')} width="30%" />
              </TableHeaderWrapper>
              {FakeData.leaderBoardData.map((val, index) => (
                <TableRow
                  key={index}
                  className="bg-light-gray calamari-text rounded-lg px-2 my-2">
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
        )}
        <div className="text-right pt-3 cursor-pointer oriange-text">
          {t('View all board')}
        </div>
      </div>
    </div>
  );
};

export default Crowdloan;
