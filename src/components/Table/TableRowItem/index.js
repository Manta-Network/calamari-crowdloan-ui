import React from 'react';
import PropTypes from 'prop-types';
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

TableRowItem.propTypes = {
  children: PropTypes.any,
  className: PropTypes.string,
  width: PropTypes.string,
  onTableRow: PropTypes.func
};

export default TableRowItem;
