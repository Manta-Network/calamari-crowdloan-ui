import React from 'react';
import PropTypes from 'prop-types';
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

TableColumnHeader.propTypes = {
  label: PropTypes.string,
  className: PropTypes.string,
  width: PropTypes.string,
  children: PropTypes.element
};

export default TableColumnHeader;
