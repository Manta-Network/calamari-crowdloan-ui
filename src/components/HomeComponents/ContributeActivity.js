import React, { useEffect, useState } from 'react';
import { Pagination } from 'semantic-ui-react';
import TableColumnHeader from 'components/Table/TableColumnHeader';
import TableHeaderWrapper from 'components/Table/TableHeaderWrapper';
import TableRow from 'components/Table/TableRow';
import TableRowItem from 'components/Table/TableRowItem';
import axios from 'axios';
import Decimal from 'decimal.js';
import { KusamaFromAtomicUnits } from 'utils/KusamaToAtomicUnits';
import { useSubstrate } from 'substrate-lib';

const ContributeActivity = () => {
  const { api } = useSubstrate();
  const [totalPages, setTotalPages] = useState(1);
  const [pageNumber, setPageNumber] = useState(1);
  const [contributions, setContributions] = useState(null);

  axios.defaults.baseURL = 'https://kusama.api.subscan.io/api/scan/parachain/';
  axios.defaults.headers.post['Content-Type'] = 'application/json';
  axios.defaults.headers.post['Access-Control-Allow-Origin'] = true;

  const PAGE_SIZE = 10;

  useEffect(() => {
    const getContributions = () => {
      axios.post('contributes', { row: PAGE_SIZE, page: pageNumber - 1, order: 'block_num desc' }).then(res => {
        setContributions(res.data.data.contributes);
        setTotalPages(Math.ceil(res.data.data.count / PAGE_SIZE));
      });
    };
    getContributions();
  }, [pageNumber]);

  const handlePageChange = (_, data) => {
    setPageNumber(data.activePage);
  };

  return (
    <div className="contributions-details p-6 md:p-10 my-4 mt-20 lg:mt-4 bg-white rounded-xl">
      <h1 className="text-2xl title md:text-4xl">
        Global Contribution Activity
      </h1>
      <div className="overflow-x-auto">
        <div className="mb-4 min-w-table">
          <TableHeaderWrapper className="px-2">
            {/* <TableColumnHeader label="Rank" width="5%" /> */}
            <TableColumnHeader label="Kusama Account" width="30%" />
            <TableColumnHeader label="Contributed" width="15%" />
            <TableColumnHeader label="Reward" width="15%" />
            {/* <TableColumnHeader label="Participants Referred" width="20%" />
            <TableColumnHeader label="Referral Reward" width="15%" /> */}
          </TableHeaderWrapper>
          {
            contributions?.map(contribution => <TableRowData contribution={contribution} key={contribution.extrinsic_index} />)
          }
        </div>
      </div>
      <div className="flex justify-end pt-2">
        <Pagination
          boundaryRange={0}
          defaultActivePage={1}
          siblingRange={1}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
};

const TableRowData = ({ contribution }) => {
  const contributionAtomicUnits = new Decimal(contribution.contributing);
  const contributionKSM = KusamaFromAtomicUnits(contributionAtomicUnits, api);
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
        <span className="text-thirdry font-semibold">{contributionKSM.toString()} KSM</span>
      </TableRowItem>
      <TableRowItem width="15%">
        <span className="manta-prime-blue font-semibold">{contributionKSM.mul(10000).toString()} KMA</span>
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
