import PropTypes from 'prop-types';
import React from 'react';
import TotalCriancasComRelAcompanhamentoAprendizagem from './CriancasComAcomp/criancasComAcomp';

const GraficosAcompanhamentoAprendizagem = props => {
  const { anoLetivo, dreId, ueId, dataUltimaConsolidacao } = props;
  return (
    <TotalCriancasComRelAcompanhamentoAprendizagem
      anoLetivo={anoLetivo}
      dreId={dreId}
      ueId={ueId}
      dataUltimaConsolidacao={dataUltimaConsolidacao}
    />
  );
};

GraficosAcompanhamentoAprendizagem.propTypes = {
  anoLetivo: PropTypes.oneOfType(PropTypes.any),
  dreId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  ueId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  dataUltimaConsolidacao: PropTypes.oneOfType(PropTypes.any),
};

GraficosAcompanhamentoAprendizagem.defaultProps = {
  anoLetivo: null,
  dreId: null,
  ueId: null,
  dataUltimaConsolidacao: null,
};

export default GraficosAcompanhamentoAprendizagem;
