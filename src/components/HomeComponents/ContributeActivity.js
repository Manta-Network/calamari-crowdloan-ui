/* eslint-disable multiline-ternary */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Pagination, Placeholder } from 'semantic-ui-react';
import TableColumnHeader from 'components/Table/TableColumnHeader';
import TableHeaderWrapper from 'components/Table/TableHeaderWrapper';
import TableRow from 'components/Table/TableRow';
import TableRowItem from 'components/Table/TableRowItem';
import axios from 'axios';
import Decimal from 'decimal.js';
import { useTranslation } from 'react-i18next';
import Calamari from 'types/Calamari';
import Contribution from 'types/Contribution';
import Kusama from 'types/Kusama';
import config from 'config';
import ReferralCode from 'types/ReferralCode';
import { hexAddPrefix, isHex } from '@polkadot/util';

const ContributeActivityPlaceholder = () => {
  const { t } = useTranslation();

  return (
    <div className="contributions-details p-6 md:p-10 my-4 mt-10 lg:mt-4 bg-white rounded-xl">
      <h1 className="text-2xl title md:text-4xl">
        {t('Global Contribution Activity')}
      </h1>
      <div className="mb-4 min-w-table-sm">
        <Placeholder fluid>
          <Placeholder.Paragraph>
            <Placeholder.Line />
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
            <Placeholder.Line />
          </Placeholder.Paragraph>
        </Placeholder>
      </div>
    </div>
  );
};

const ContributeActivity = ({ allContributions }) => {
  const [totalPages, setTotalPages] = useState(1);
  const [pageNumber, setPageNumber] = useState(1);
  const [contributions, setContributions] = useState(null);
  const [referralCounts, setReferralCounts] = useState(null);
  const [referralRewards, setReferralRewards] = useState(null);

  const { t } = useTranslation();
  const PAGE_SIZE = 10;

  const handlePageChange = (_, data) => {
    setPageNumber(data.activePage);
  };

  useEffect(() => {
    const getContributions = () => {
      axios.post('parachain/contributes', { fund_id: config.FUND_ID, row: PAGE_SIZE, page: pageNumber - 1, order: 'block_num desc', from_history: true }).then(res => {
        const contributions = res.data.data.contributes.map(contribution => {
          const amountKSM = new Kusama(Kusama.ATOMIC_UNITS, new Decimal(contribution.contributing)).toKSM();
          const referralCode = (isHex(hexAddPrefix(contribution.memo)) && contribution.memo.length === 64) ? ReferralCode.fromHexStr(contribution.memo) : null;
          return new Contribution(amountKSM, new Date(contribution.block_timestamp * 1000), contribution.who, referralCode);
        });
        setContributions(contributions);
        setTotalPages(Math.ceil(res.data.data.count / PAGE_SIZE));
      });
    };
    getContributions();
  }, [pageNumber]);

  useEffect(() => {
    if (!allContributions || !contributions) {
      return;
    }
    const getReferralCountsAndRewards = () => {
      const referralsByContribution = contributions.map(currentPageContribution => {
        return allContributions.filter(someContribution => {
          return someContribution.referral?.toAddress() === currentPageContribution.who;
        });
      });
      const referralCounts = referralsByContribution.map(referredTransactions => {
        return referredTransactions.map(transaction => transaction.address).filter((address, i, self) => self.indexOf(address) === i).length;
      });

      const referralRewards = referralsByContribution.map(referredTransactions => {
        return referredTransactions.reduce((acc, transaction) => acc.add(transaction.amountKSM.toKMAGaveReferralReward()), Calamari.zero());
      });
      return [referralCounts, referralRewards];
    };
    const [referralCounts, referralRewards] = getReferralCountsAndRewards();
    setReferralCounts(referralCounts);
    setReferralRewards(referralRewards);
  }, [allContributions, contributions]);

  if (!contributions) {
    return <ContributeActivityPlaceholder />;
  }
  return (
    <div className="contributions-details p-6 md:p-10 my-4 mt-10 lg:mt-4 bg-white rounded-xl">
      <h1 className="text-2xl title md:text-4xl">
        {t('Global Contribution Activity')}
      </h1>
      <div className="mb-4 min-w-table-sm">
        <TableHeaderWrapper className="px-2">
          <TableColumnHeader label={t('Address')} width="40%" />
          <TableColumnHeader label={t('Contributed')} width="13%" />
          <TableColumnHeader label={t('Rewards')} width="17%" />
          {(referralCounts && referralRewards) &&
            <>
              <TableColumnHeader label={t('Referrals')} width="13%" />
              <TableColumnHeader label={t('Referral rewards')} width="17%" />
            </>
          }
        </TableHeaderWrapper>
        {
          contributions?.map((contribution, i) => {
            return (
              <TableRowData
                contribution={contribution}
                key={contribution.address + contribution.date.toString()}
                referralCount={referralCounts && referralCounts[i]}
                referralReward={referralRewards && referralRewards[i]}
              />
            );
          })
        }
      </div>
      <div className="flex justify-center pt-2">
        <Pagination
          boundaryRange={0}
          defaultActivePage={1}
          siblingRange={2}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          size="mini"
        />
      </div>
    </div>
  );
};

ContributeActivity.propTypes = {
  allContributions: PropTypes.arrayOf(PropTypes.instanceOf(Contribution))
};

const TableRowData = ({ contribution, referralCount, referralReward }) => {
  return (
    <TableRow className="bg-light-gray calamari-text rounded-md px-2 my-2">
      <TableRowItem width="40%">
        <div className="text-blue-thirdry overflow-hidden" style={{ textOverflow: 'ellipsis' }}>
          {contribution.address}
        </div>
      </TableRowItem>
      <TableRowItem width="13%">
        <span className="text-thirdry font-semibold">{contribution.amountKSM.toString()}</span>
      </TableRowItem>
      <TableRowItem width="17%">
        <span className="manta-prime-blue font-semibold">{contribution.amountKSM.value.mul(10000).toString()} KMA</span>
      </TableRowItem>
      {(referralCount !== null && referralReward !== null) &&
        <>
          <TableRowItem width="13%">
            <span className="text-thirdry font-semibold">{referralCount && referralCount}</span>
          </TableRowItem>
          <TableRowItem width="17%">
            <span className="text-thirdry font-semibold">{referralReward && referralReward.toString()}</span>
          </TableRowItem>
        </>
      }
    </TableRow>
  );
};

TableRowData.propTypes = {
  contribution: PropTypes.instanceOf(Contribution),
  referralCount: PropTypes.number,
  referralReward: PropTypes.instanceOf(Calamari)
};

export default ContributeActivity;
