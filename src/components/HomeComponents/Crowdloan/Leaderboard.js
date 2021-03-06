import React from 'react';
import PropTypes from 'prop-types';
import Kusama from 'types/Kusama';
import { useTranslation } from 'react-i18next';
import { Placeholder } from 'semantic-ui-react';
import TableColumnHeader from 'components/Table/TableColumnHeader';
import TableHeaderWrapper from 'components/Table/TableHeaderWrapper';
import TableRow from 'components/Table/TableRow';
import TableRowItem from 'components/Table/TableRowItem';
import Contribution from 'types/Contribution';
import config from 'config';

const LeaderboardPlaceholder = () => {
  const { t } = useTranslation();
  return (
    <div className="item p-8 mt-6 xl:px-10 xl:py-6 bg-white">
      <h1 className="title text-3xl md:text-4xl">{t('Leaderboard')}</h1>
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
    </div>
  );
};

export default function Leaderboard ({ allContributions }) {
  const { t } = useTranslation();

  const getTopThreeContributors = () => {
    if (!allContributions) {
      return null;
    }
    const contributionsByAddress = {};
    allContributions.forEach((contribution) => {
      const addressCurrentContribution =
        contributionsByAddress[contribution.address] || Kusama.zero();
      contributionsByAddress[contribution.address] =
        addressCurrentContribution.add(contribution.amountKSM);
    });

    return Object.entries(contributionsByAddress)
      .map(([address, amountKSM]) => ({
        address: address,
        amountKSM: amountKSM
      }))
      .sort((first, second) => second.amountKSM.value.minus(first.amountKSM.value))
      .slice(0, 3);
  };
  const topThreeContributors = getTopThreeContributors();
  if (!topThreeContributors) {
    return <LeaderboardPlaceholder />;
  }

  return (
    <div className="item flex-auto p-8 mt-6 xl:px-10 xl:py-6 bg-white">
      <h1 className="title text-3xl md:text-4xl">{t('Leaderboard')}</h1>
      <div className="overflow-x-auto border-2 rounded-lg">
        <div className="min-w-table-sm ">
          <TableHeaderWrapper className="px-2">
            <TableColumnHeader label={t('Rank')} width="20%" />
            <TableColumnHeader label={t('Address')} width="40%" />
            <TableColumnHeader label={t('Contributed')} width="40%" />
          </TableHeaderWrapper>
          {topThreeContributors.map((val, i) => (
            <TableRow className="bg-light-gray calamari-text rounded-lg px-2 my-2" key={val.address}>
              <TableRowItem width="20%">
                <div className="w-8 h-8 bg-purple text-white leading-8 text-center rounded-md">
                  {i + 1}
                </div>
              </TableRowItem>
              <TableRowItem width="40%">
                <a target="_blank" rel="noopener noreferrer" href={config.ADDRESS_BLOCK_EXPLORER_URL + val.address}>
                  <div
                    style={{ textOverflow: 'ellipsis' }}
                    className="overflow-hidden">
                    {val.address}
                  </div>
                </a>
              </TableRowItem>
              <TableRowItem width="40%">
                <span className="text-thirdry font-semibold">
                  {val.amountKSM.toString()}
                </span>
              </TableRowItem>
            </TableRow>
          ))}
        </div>
      </div>
    </div>
  );
}

Leaderboard.propTypes = {
  allContributions: PropTypes.arrayOf(PropTypes.instanceOf(Contribution))
};
