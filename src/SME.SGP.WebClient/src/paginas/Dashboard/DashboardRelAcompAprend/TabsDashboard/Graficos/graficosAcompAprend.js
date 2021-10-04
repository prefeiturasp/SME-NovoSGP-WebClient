import PropTypes from 'prop-types';
import React from 'react';
import { OPCAO_TODOS } from '~/constantes';
import TotalCriancasComRelAcompanhamentoAprendizagem from './CriancasComAcomp/criancasComAcomp';
import TotalCriancasComAcompPorDRE from './CriancasComAcompPorDRE/totalCriancasComAcompPorDRE';

const GraficosAcompanhamentoAprendizagem = props => {
  const { anoLetivo, dreId, ueId, dataUltimaConsolidacao } = props;
  return (
    <>
      <TotalCriancasComRelAcompanhamentoAprendizagem
        anoLetivo={anoLetivo}
        dreId={dreId}
        ueId={ueId}
        dataUltimaConsolidacao={dataUltimaConsolidacao}
      />
      {dreId === OPCAO_TODOS ? (
        <TotalCriancasComAcompPorDRE anoLetivo={anoLetivo} />
      ) : (
        <></>
      )}
    </>
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
