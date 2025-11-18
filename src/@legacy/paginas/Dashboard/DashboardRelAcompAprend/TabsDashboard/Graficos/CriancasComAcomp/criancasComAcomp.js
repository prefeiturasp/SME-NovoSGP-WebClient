import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { Base } from '~/componentes';
import CardCollapse from '~/componentes/cardCollapse';
import { SGP_COLLAPSE_TOTAL_CRIANCAS_RELATORIO_ACOMPANHAMENTO_APRENDIZADO } from '~/constantes/ids/collapse';
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
        id={SGP_COLLAPSE_TOTAL_CRIANCAS_RELATORIO_ACOMPANHAMENTO_APRENDIZADO}
        titulo="Total de crianças com relatório do acompanhamento da aprendizagem registrado"
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
  anoLetivo: PropTypes.oneOfType([PropTypes.any]),
  dreId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  ueId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  dataUltimaConsolidacao: PropTypes.oneOfType([PropTypes.any]),
};

TotalCriancasComRelAcompanhamentoAprendizagem.defaultProps = {
  anoLetivo: null,
  dreId: null,
  ueId: null,
  dataUltimaConsolidacao: null,
};

export default TotalCriancasComRelAcompanhamentoAprendizagem;
