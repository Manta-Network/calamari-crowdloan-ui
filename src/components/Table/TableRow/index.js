import React from 'react';
import PropTypes from 'prop-types';
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

TableRow.propTypes = {
  children: PropTypes.any,
  className: PropTypes.string,
  highlight: PropTypes.bool
};

export default TableRow;
