import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';

const CardEstilo = styled.div`
  padding: 16px !important;
  border-radius: 4px;
`;

const Card = props => {
  const { children, className } = props;
  return (
    <CardEstilo className={`shadow bg-white ${className}`}>
      {children}
    </CardEstilo>
  );
};

Card.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
};

Card.defaultProps = {
  children: {},
  className: '',
};

export default Card;
