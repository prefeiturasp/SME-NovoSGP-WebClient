import PropTypes from 'prop-types';
import React from 'react';
import GraficoQuantidadeMatriculasPorAno from './QuantidadeMatriculasPorAno/graficoQuantidadeMatriculasPorAno';

const GraficosMatriculas = props => {
  const { anoLetivo, dreId, ueId, modalidade } = props;
  return (
    <GraficoQuantidadeMatriculasPorAno
      anoLetivo={anoLetivo}
      dreId={dreId}
      ueId={ueId}
      modalidade={modalidade}
    />
  );
};

GraficosMatriculas.propTypes = {
  anoLetivo: PropTypes.oneOfType([PropTypes.any]),
  dreId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  ueId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  modalidade: PropTypes.string,
};

GraficosMatriculas.defaultProps = {
  anoLetivo: null,
  dreId: null,
  ueId: null,
  modalidade: '',
};

export default GraficosMatriculas;
