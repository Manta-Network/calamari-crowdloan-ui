import React from 'react';
import TableColumnHeader from 'components/Table/TableColumnHeader';
import TableHeaderWrapper from 'components/Table/TableHeaderWrapper';
import TableRow from 'components/Table/TableRow';
import TableRowItem from 'components/Table/TableRowItem';

const Contributions = () => {
  return (
    <div className="contributions-details p-10 my-4 bg-white rounded-xl">
      <h1 className="title">Contributions in Details</h1>
      <div className="overflow-x-auto">
        <div className="mb-4 min-w-table">
          <TableHeaderWrapper className="px-2">
            <TableColumnHeader label="Rank" width="5%" />
            <TableColumnHeader label="Kusama Account" width="30%" />
            <TableColumnHeader label="Contributed" width="15%" />
            <TableColumnHeader label="Contributed Reward" width="15%" />
            <TableColumnHeader label="Participants Referred" width="20%" />
            <TableColumnHeader label="Referral Reward" width="15%" />
          </TableHeaderWrapper>
          <TableRowData />
          <TableRowData />
          <TableRowData />
        </div>
      </div>
    </div>
  );
};

const TableRowData = () => {
  return (
    <TableRow className="bg-light-gray calamari-text rounded-lg px-2 my-3">
      <TableRowItem width="5%">
        <div className="w-8 h-8 bg-purple text-white leading-8 text-center rounded-md">
          1
        </div>
      </TableRowItem>
      <TableRowItem width="30%">
        <span className="text-blue-thirdry">
          12T1tgaYZzEkFpnPvyqttmPRJxbGbR4uDx49cvZR5SRF8QDu
        </span>
      </TableRowItem>
      <TableRowItem width="15%">
        <span className="text-thirdry font-semibold">2103524.3704</span>
      </TableRowItem>
      <TableRowItem width="15%">
        <span className="manta-prime-blue font-semibold">2103524.3704</span>
      </TableRowItem>
      <TableRowItem width="20%">
        <span className="text-thirdry font-semibold">2</span>
      </TableRowItem>
      <TableRowItem width="15%">
        <span className="text-thirdry font-semibold">3.0148</span>
      </TableRowItem>
    </TableRow>
  );
};

export default Contributions;
