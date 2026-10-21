import React from 'react';
import PropTypes from 'prop-types';
import comDefaultProps from '~/utils/comDefaultProps';

const CardBody = props => {
  const { children, className, style } = props;

  return (
    <div style={style} className={`card-body ${className}`}>
      {children}
    </div>
  );
};

CardBody.propTypes = {
  children: PropTypes.node,
};

CardBody.defaultProps = {
  children: () => {},
};

export default comDefaultProps(CardBody, CardBody.defaultProps);
