/* eslint-disable multiline-ternary */
import React, { useState, useEffect } from 'react';
import { Pagination, Placeholder } from 'semantic-ui-react';
import TableColumnHeader from 'components/Table/TableColumnHeader';
import TableHeaderWrapper from 'components/Table/TableHeaderWrapper';
import TableRow from 'components/Table/TableRow';
import TableRowItem from 'components/Table/TableRowItem';
import axios from 'axios';
import Decimal from 'decimal.js';
import Kusama from '../../types/Kusama';
import config from '../../config';
import { useTranslation } from 'react-i18next';


const ContributeActivityPlaceholder = () => {
  const { t } = useTranslation();

  return (
    <div className="contributions-details p-6 md:p-10 my-4 mt-10 lg:mt-4 bg-white rounded-xl">
      <h1 className="text-2xl title md:text-4xl">
        {t("Global Contribution Activity")}
      </h1>
        <div className="overflow-x-auto">
          <div className="mb-4 min-w-table">
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
          </Placeholder.Paragraph>
        </Placeholder>
        </div>
      </div>
    </div>
  )
}

const ContributeActivity = () => {
  const [totalPages, setTotalPages] = useState(1);
  const [pageNumber, setPageNumber] = useState(1);
  const [contributions, setContributions] = useState(null);

  const { t } = useTranslation();
  const PAGE_SIZE = 10;

  const handlePageChange = (_, data) => {
    setPageNumber(data.activePage);
  };


  useEffect(() => {
    const getContributions = () => {
      axios.post('parachain/contributes', { fund_id: config.FUND_ID, row: PAGE_SIZE, page: pageNumber - 1, order: 'block_num desc', from_history: true }).then(res => {
        setContributions(res.data.data.contributes);
        setTotalPages(Math.ceil(res.data.data.count / PAGE_SIZE));
      });
    };
    getContributions();
  }, [pageNumber]);


  if (!contributions) {
    return <ContributeActivityPlaceholder />
  }
  return (
    <div className="contributions-details p-6 md:p-10 my-4 mt-10 lg:mt-4 bg-white rounded-xl">
      <h1 className="text-2xl title md:text-4xl">
        {t("Global Contribution Activity")}
      </h1>
      <div className="overflow-x-auto">
        <div className="mb-4 min-w-table">
        </div>
          <div className="mb-4 min-w-table">
            <TableHeaderWrapper className="px-2">
              {/* <TableColumnHeader label="Rank" width="5%" /> */}
              <TableColumnHeader label="Kusama Account" width="30%" />
              <TableColumnHeader label="Contributed" width="15%" />
              <TableColumnHeader label="Contributed Reward" width="15%" />
              {/* <TableColumnHeader label="Participants Referred" width="20%" />
              <TableColumnHeader label="Referral Reward" width="15%" /> */}
            </TableHeaderWrapper>
            {
              contributions?.map(contribution => <TableRowData contribution={contribution} key={contribution.extrinsic_index} />)
            }
          </div>
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

const TableRowData = ({ contribution }) => {
  const contributionKSM = new Kusama(Kusama.ATOMIC_UNITS, new Decimal(contribution.contributing)).toKSM();
  return (
    <TableRow className="bg-light-gray calamari-text rounded-lg px-2 my-3">
      {/* <TableRowItem width="5%">
        <div className="w-8 h-8 bg-purple text-white leading-8 text-center rounded-md">
          1
        </div>
      </TableRowItem> */}
      <TableRowItem width="30%">
        <span className="text-blue-thirdry">
          {contribution.who}
        </span>
      </TableRowItem>
      <TableRowItem width="15%">
        <span className="text-thirdry font-semibold">{contributionKSM.toString()}</span>
      </TableRowItem>
      <TableRowItem width="15%">
        <span className="manta-prime-blue font-semibold">{contributionKSM.value.mul(10000).toString()} KMA</span>
      </TableRowItem>
      {/* <TableRowItem width="20%">
        <span className="text-thirdry font-semibold">2</span>
      </TableRowItem>
      <TableRowItem width="15%">
        <span className="text-thirdry font-semibold">3.0148</span>
      </TableRowItem> */}
    </TableRow>
  );
};

export default ContributeActivity;
