import React from 'react';
import styled from 'styled-components';

const CardEstilo = styled.div`
  padding: 16px !important;
  border-radius: 4px;
`;

const Card = props => {
  const { children, className, mtop, mx } = props;

  return (
    <CardEstilo
      className={`row shadow ${!mx ? 'mx-3' : mx} ${mtop ||
        ''} bg-white ${className || ''}`}
    >
      {children}
    </CardEstilo>
  );
};

export default Card;
