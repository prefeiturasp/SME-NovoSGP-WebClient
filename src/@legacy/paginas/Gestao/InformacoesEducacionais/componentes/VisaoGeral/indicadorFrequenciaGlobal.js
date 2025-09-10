import React from 'react';
import PropTypes from 'prop-types';
import CartaoIndicador from './cartaoIdentificador';

const IndicadorFrequenciaGlobal = ({ dados, loading }) => {
  return (
    <CartaoIndicador
      titulo="Frequência global"
      tooltip="Percentual médio de presença dos alunos nas atividades escolares."
      dados={dados}
      loading={loading}
    />
  );
};

IndicadorFrequenciaGlobal.propTypes = {
  dados: PropTypes.array,
  loading: PropTypes.bool,
};

IndicadorFrequenciaGlobal.defaultProps = {
  dados: [],
  loading: false,
};

export default IndicadorFrequenciaGlobal;