import PropTypes from 'prop-types';
import React from 'react';
import TotalCriancasComRelAcompanhamentoAprendizagem from './CriancasComRelAcompanhamentoAprendizagem/criancasComAcomp';

const GraficosAcompanhamentoAprendizagem = props => {
  const { anoLetivo, dreId, ueId } = props;
  return (
    <TotalCriancasComRelAcompanhamentoAprendizagem
      anoLetivo={anoLetivo}
      dreId={dreId}
      ueId={ueId}
    />
  );
};

GraficosAcompanhamentoAprendizagem.propTypes = {
  anoLetivo: PropTypes.oneOfType(PropTypes.any),
  dreId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  ueId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

GraficosAcompanhamentoAprendizagem.defaultProps = {
  anoLetivo: null,
  dreId: null,
  ueId: null,
};

export default GraficosAcompanhamentoAprendizagem;
