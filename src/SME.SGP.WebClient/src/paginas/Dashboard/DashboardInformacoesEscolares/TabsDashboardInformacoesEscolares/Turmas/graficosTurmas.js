import PropTypes from 'prop-types';
import React from 'react';
import GraficoQuantidadeTurmasPorAno from './QuantidadeTurmasPorAno/graficoQuantidadeTurmasPorAno';

const GraficosTurmas = props => {
  const { anoLetivo, dreId, ueId, modalidade } = props;
  return (
    <GraficoQuantidadeTurmasPorAno
      anoLetivo={anoLetivo}
      dreId={dreId}
      ueId={ueId}
      modalidade={modalidade}
    />
  );
};

GraficosTurmas.propTypes = {
  anoLetivo: PropTypes.oneOfType(PropTypes.any),
  dreId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  ueId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  modalidade: PropTypes.string,
};

GraficosTurmas.defaultProps = {
  anoLetivo: null,
  dreId: null,
  ueId: null,
  modalidade: '',
};

export default GraficosTurmas;
