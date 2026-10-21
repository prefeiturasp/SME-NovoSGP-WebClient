import React from 'react';
import PropTypes from 'prop-types';
import CartaoIndicador from './cartaoIdentificador';

import comDefaultProps from '~/utils/comDefaultProps';
const IndicadorIdep = ({ dados, loading }) => {
  return (
    <CartaoIndicador
      titulo="IDEP"
      tooltip="Índice de Desenvolvimento da Educação Paulistana"
      dados={dados}
      loading={loading}
    />
  );
};

IndicadorIdep.propTypes = {
  dados: PropTypes.array,
  loading: PropTypes.bool,
};

IndicadorIdep.defaultProps = {
  dados: [],
  loading: false,
};

export default comDefaultProps(IndicadorIdep, IndicadorIdep.defaultProps);