import React from 'react';
import Kusama from 'types/Kusama';
import { useTranslation } from 'react-i18next';
import { Placeholder } from 'semantic-ui-react';
import TableColumnHeader from 'components/Table/TableColumnHeader';
import TableHeaderWrapper from 'components/Table/TableHeaderWrapper';
import TableRow from 'components/Table/TableRow';
import TableRowItem from 'components/Table/TableRowItem';

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
      .sort((first, second) => first.amountKSM.value.gt(second.amountKSM.value))
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
        <div className="min-w-table-md ">
          <TableHeaderWrapper className="px-2">
            <TableColumnHeader label={t('Rank')} width="15%" />
            <TableColumnHeader label={t('Address')} width="30%" />
            <TableColumnHeader label={t('Contributed')} width="25%" />
          </TableHeaderWrapper>
          {topThreeContributors.map((val, i) => (
            <TableRow className="bg-light-gray calamari-text rounded-lg px-2 my-2">
              <TableRowItem width="15%">
                <div className="w-8 h-8 bg-purple text-white leading-8 text-center rounded-md">
                  {i + 1}
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
