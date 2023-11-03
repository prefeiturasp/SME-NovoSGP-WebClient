import PropTypes from 'prop-types';
import React from 'react';
import { Col } from 'antd';

const ColunaDimensionavel = props => {
  const { children, novaEstrutura, dimensao } = props;

  let dimensaoCalculada = dimensao;

  if (novaEstrutura) {
    dimensaoCalculada = Number(dimensaoCalculada) * 2;
  }

  return novaEstrutura ? (
    <Col sm={24} lg={dimensaoCalculada}>
      {children}
    </Col>
  ) : (
    <div className={`col-12 col-lg-${dimensao} mb-3`}>{children}</div>
  );
};

ColunaDimensionavel.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  novaEstrutura: PropTypes.bool,
  dimensao: PropTypes.number,
};

ColunaDimensionavel.defaultProps = {
  children: null,
  novaEstrutura: false,
  dimensao: 12,
};

export default ColunaDimensionavel;
