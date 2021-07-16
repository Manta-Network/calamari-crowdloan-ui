/* eslint-disable multiline-ternary */
import React, { useState, useEffect } from 'react';
import { Pagination, Placeholder } from 'semantic-ui-react';
import TableColumnHeader from 'components/Table/TableColumnHeader';
import TableHeaderWrapper from 'components/Table/TableHeaderWrapper';
import TableRow from 'components/Table/TableRow';
import TableRowItem from 'components/Table/TableRowItem';

const ContributeActivity = () => {
  const [showPlaceholder, setShowPlaceholder] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setShowPlaceholder(false);
    }, 2000);
  }, []);

  return (
    <div className="contributions-details p-6 md:p-10 my-4 mt-10 lg:mt-4 bg-white rounded-xl">
      <h1 className="text-2xl title md:text-4xl">
        Global Contribution Activity
      </h1>
      <div className="overflow-x-auto">
        {showPlaceholder ? (
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
        ) : (
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
        )}
      </div>
      <div className="flex justify-center pt-2">
        <Pagination
          boundaryRange={0}
          defaultActivePage={1}
          ellipsisItem={null}
          firstItem={null}
          size="mini"
          lastItem={null}
          siblingRange={2}
          totalPages={10}
        />
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

export default ContributeActivity;
