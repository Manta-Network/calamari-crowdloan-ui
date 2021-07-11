import React from 'react';
import classNames from 'classnames';

const TableColumnHeader = ({ label, className, width = 'auto', children }) => {
  return (
    <div
      style={{ width }}
      className={classNames(
        'box-border text-sm inline-block p-2 manta-gray font-semibold',
        className,
      )}
    >
      {label ? label : children}
    </div>
  );
};

export default TableColumnHeader;
