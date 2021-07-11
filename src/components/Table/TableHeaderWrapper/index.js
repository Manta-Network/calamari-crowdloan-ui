import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const TableHeaderWrapper = ({ children, className }) => {
  return (
    <div className={classNames('flex w-full items-center bottom-border-dashed', className)}>
      {children}
    </div>
  );
};

TableHeaderWrapper.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
};

export default TableHeaderWrapper;
