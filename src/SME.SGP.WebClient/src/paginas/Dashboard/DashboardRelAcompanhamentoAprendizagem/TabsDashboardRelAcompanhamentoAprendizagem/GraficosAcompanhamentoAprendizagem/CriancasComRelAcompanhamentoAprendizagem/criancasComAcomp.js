import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { Base } from '~/componentes';
import CardCollapse from '~/componentes/cardCollapse';
import GraficoTotalCriancasComRelAcompanhamentoAprendizagem from './graficoTotalCriancas';

const TotalCriancasComRelAcompanhamentoAprendizagem = props => {
  const { anoLetivo, dreId, ueId, dataUltimaConsolidacao } = props;

  const configCabecalho = {
    altura: '44px',
    corBorda: Base.AzulBordaCollapse,
  };

  const [exibir, setExibir] = useState(false);

  const key = 'total-criancas-relatorio-acompanhamento-aprendizagem-registrado';

  return (
    <div className="mt-3">
      <CardCollapse
        titulo="Total de crianças com Relatório do Acompanhamento da Aprendizagem registrado"
        key={`${key}-collapse-key`}
        indice={`${key}-collapse-indice`}
        alt={`${key}-alt`}
        configCabecalho={configCabecalho}
        show={exibir}
        onClick={() => {
          setExibir(!exibir);
        }}
      >
        {exibir ? (
          <GraficoTotalCriancasComRelAcompanhamentoAprendizagem
            anoLetivo={anoLetivo}
            dreId={dreId}
            ueId={ueId}
            dataUltimaConsolidacao={dataUltimaConsolidacao}
          />
        ) : (
          ''
        )}
      </CardCollapse>
    </div>
  );
};

TotalCriancasComRelAcompanhamentoAprendizagem.propTypes = {
  anoLetivo: PropTypes.oneOfType(PropTypes.any),
  dreId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  ueId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  dataUltimaConsolidacao: PropTypes.oneOfType(PropTypes.any),
};

TotalCriancasComRelAcompanhamentoAprendizagem.defaultProps = {
  anoLetivo: null,
  dreId: null,
  ueId: null,
  dataUltimaConsolidacao: null,
};

export default TotalCriancasComRelAcompanhamentoAprendizagem;
