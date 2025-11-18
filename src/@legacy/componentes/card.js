import { Row } from 'antd';
import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';

const CardEstilo = styled.div`
  padding: ${props => props.padding};
  border-radius: 4px;
`;

const Card = props => {
  const { children, className, padding, addRow } = props;
  return (
    <CardEstilo className={`shadow bg-white ${className}`} padding={padding}>
      {addRow ? <Row>{children}</Row> : children}
    </CardEstilo>
  );
};

Card.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  padding: PropTypes.string,
  addRow: PropTypes.bool,
};

Card.defaultProps = {
  children: {},
  className: '',
  padding: '24px 8px',
  addRow: true,
};

export default Card;
