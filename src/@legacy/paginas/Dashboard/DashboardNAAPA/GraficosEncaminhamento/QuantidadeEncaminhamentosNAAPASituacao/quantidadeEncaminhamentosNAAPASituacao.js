import React, { useState, memo } from 'react';
import { Base } from '~/componentes';
import CardCollapse from '~/componentes/cardCollapse';
import GraficoQuantidadeEncaminhamentosNAAPASituacao from './graficoQuantidadeEncaminhamentosNAAPASituacao';

const QuantidadeEncaminhamentosNAAPASituacao = () => {
  const configCabecalho = {
    altura: '44px',
    corBorda: Base.AzulBordaCollapse,
  };

  const [exibir, setExibir] = useState(false);

  const key = 'quantidade-encaminhamentos-naapa-situacao';

  return (
    <div className="mt-3">
      <CardCollapse
        titulo="Quantidade de encaminhamentos NAAPA por situação"
        key={`${key}-collapse-key`}
        indice={`${key}-collapse-indice`}
        alt={`${key}-alt`}
        configCabecalho={configCabecalho}
        show={exibir}
        onClick={() => {
          setExibir(!exibir);
        }}
      >
        {exibir && <GraficoQuantidadeEncaminhamentosNAAPASituacao />}
      </CardCollapse>
    </div>
  );
};

export default memo(QuantidadeEncaminhamentosNAAPASituacao);
