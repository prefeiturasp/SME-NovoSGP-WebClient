import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { Base } from '~/componentes';
import CardCollapse from '~/componentes/cardCollapse';
import GraficoTotalCriancasComAcompPorDRE from './graficoCriancasComAcompPorDRE';

const TotalCriancasComAcompPorDRE = props => {
  const { anoLetivo, dataUltimaConsolidacao } = props;

  const configCabecalho = {
    altura: '44px',
    corBorda: Base.AzulBordaCollapse,
  };

  const [exibir, setExibir] = useState(false);

  const key = 'total-criancas-relatorio-acompanhamento-aprendizagem-por-dre';

  return (
    <div className="mt-3">
      <CardCollapse
        titulo="Total de crianças com relatório do acompanhamento da aprendizagem por DRE"
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
          <GraficoTotalCriancasComAcompPorDRE
            anoLetivo={anoLetivo}
            dataUltimaConsolidacao={dataUltimaConsolidacao}
          />
        ) : (
          <></>
        )}
      </CardCollapse>
    </div>
  );
};

TotalCriancasComAcompPorDRE.propTypes = {
  anoLetivo: PropTypes.oneOfType([PropTypes.any]),
  dataUltimaConsolidacao: PropTypes.oneOfType([PropTypes.any]),
};

TotalCriancasComAcompPorDRE.defaultProps = {
  anoLetivo: null,
  dataUltimaConsolidacao: null,
};

export default TotalCriancasComAcompPorDRE;
