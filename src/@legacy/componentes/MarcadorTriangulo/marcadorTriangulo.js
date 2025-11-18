import React from 'react';
import PropTypes from 'prop-types';

import { Base } from '~/componentes/colors';

import { Container } from './marcadorTriangulo.css';

const MarcadorTriangulo = ({ corFundo, ...rest }) => (
  <Container cor={corFundo} {...rest} />
);

MarcadorTriangulo.propTypes = {
  corFundo: PropTypes.string,
};

MarcadorTriangulo.defaultProps = {
  corFundo: Base.LaranjaCalendario,
};

export default MarcadorTriangulo;
