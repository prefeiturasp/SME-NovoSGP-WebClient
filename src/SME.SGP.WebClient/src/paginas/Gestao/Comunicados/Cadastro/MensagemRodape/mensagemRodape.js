import React from 'react';
import PropTypes from 'prop-types';

import { Container } from './mensagemRodape.css';

function MensagemRodape({ children }) {
  return <Container>{children}</Container>;
}

MensagemRodape.propTypes = {
  children: PropTypes.string.isRequired,
};

export default MensagemRodape;
