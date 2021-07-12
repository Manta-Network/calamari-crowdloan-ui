/* eslint-disable react/prop-types */
import React from 'react';
import classNames from 'classnames';

const TableRowItem = ({ children, className, width = '', onTableRow }) => {
  return (
    <div
      style={{ width }}
      onClick={onTableRow}
      className={classNames('box-border inline-block p-2', className)}>
      {children}
    </div>
  );
};

export default TableRowItem;
