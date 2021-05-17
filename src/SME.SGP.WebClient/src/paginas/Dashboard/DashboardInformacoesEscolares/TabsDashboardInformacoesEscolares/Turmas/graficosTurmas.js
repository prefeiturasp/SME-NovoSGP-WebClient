import PropTypes from 'prop-types';
import React from 'react';
import GraficoQuantidadeTurmasPorAno from './QuantidadeTurmasPorAno/graficoQuantidadeTurmasPorAno';

const GraficosTurmas = props => {
  const { anoLetivo, dreId, ueId, modalidade, listaAnosEscolares } = props;
  return (
    <GraficoQuantidadeTurmasPorAno
      anoLetivo={anoLetivo}
      dreId={dreId}
      ueId={ueId}
      modalidade={modalidade}
      listaAnosEscolares={listaAnosEscolares}
    />
  );
};

GraficosTurmas.propTypes = {
  anoLetivo: PropTypes.oneOfType(PropTypes.any),
  dreId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  ueId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  modalidade: PropTypes.string,
  listaAnosEscolares: PropTypes.oneOfType(PropTypes.array),
};

GraficosTurmas.defaultProps = {
  anoLetivo: null,
  dreId: null,
  ueId: null,
  modalidade: '',
  listaAnosEscolares: [],
};

export default GraficosTurmas;
