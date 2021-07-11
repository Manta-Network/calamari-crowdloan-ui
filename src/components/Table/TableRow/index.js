/* eslint-disable react/prop-types */
import React from 'react';
import classNames from 'classnames';

const TableRow = ({ children, className, highlight }) => {
  return (
    <div
      className={classNames('flex w-full items-center', { 'bg-table-row': highlight }, className)}
    >
      {children}
    </div>
  );
};

export default TableRow;
