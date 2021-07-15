import React from 'react';
import classNames from 'classnames';

const TableColumnHeader = ({ label, className, width = 'auto', children }) => {
  return (
    <div
      style={{ width }}
      className={classNames(
        'box-border text-base inline-block p-2 text-gray font-semibold',
        className
      )}>
      {label || children}
    </div>
  );
};

export default TableColumnHeader;
