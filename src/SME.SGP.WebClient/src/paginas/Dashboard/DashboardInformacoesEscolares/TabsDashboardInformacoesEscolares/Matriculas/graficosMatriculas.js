import PropTypes from 'prop-types';
import React from 'react';
import GraficoQuantidadeMatriculasPorAno from './QuantidadeMatriculasPorAno/graficoQuantidadeMatriculasPorAno';

const GraficosMatriculas = props => {
  const { anoLetivo, dreId, ueId, modalidade, listaAnosEscolares } = props;
  return (
    <GraficoQuantidadeMatriculasPorAno
      anoLetivo={anoLetivo}
      dreId={dreId}
      ueId={ueId}
      modalidade={modalidade}
      listaAnosEscolares={listaAnosEscolares}
    />
  );
};

GraficosMatriculas.propTypes = {
  anoLetivo: PropTypes.oneOfType(PropTypes.any),
  dreId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  ueId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  modalidade: PropTypes.string,
  listaAnosEscolares: PropTypes.oneOfType(PropTypes.array),
};

GraficosMatriculas.defaultProps = {
  anoLetivo: null,
  dreId: null,
  ueId: null,
  modalidade: '',
  listaAnosEscolares: [],
};

export default GraficosMatriculas;
