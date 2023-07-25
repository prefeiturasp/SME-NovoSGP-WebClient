import React, { useState, memo } from 'react';
import { Base } from '~/componentes';
import CardCollapse from '~/componentes/cardCollapse';
import GraficoQuantidadeEncaminhamentosNAAPA from './graficoQuantidadeEncaminhamentosNAAPA';

const QuantidadeEncaminhamentosNAAPA = () => {
  const configCabecalho = {
    altura: '44px',
    corBorda: Base.AzulBordaCollapse,
  };

  const [exibir, setExibir] = useState(false);

  const key = 'quantidade-encaminhamentos-naapa';

  return (
    <div className="mt-3">
      <CardCollapse
        titulo="Quantidade de encaminhamentos por DRE"
        key={`${key}-collapse-key`}
        indice={`${key}-collapse-indice`}
        alt={`${key}-alt`}
        configCabecalho={configCabecalho}
        show={exibir}
        onClick={() => {
          setExibir(!exibir);
        }}
      >
        {exibir && <GraficoQuantidadeEncaminhamentosNAAPA />}
      </CardCollapse>
    </div>
  );
};

export default memo(QuantidadeEncaminhamentosNAAPA);
