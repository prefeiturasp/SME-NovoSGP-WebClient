import React, { useState } from 'react';
import { Base } from '~/componentes';
import CardCollapse from '~/componentes/cardCollapse';
import GraficoQuantidadeNaoFrequentaramUE from './graficoQuantidadeNaoFrequentaramUE';

const QuantidadeNaoFrequentaramUE = () => {
  const configCabecalho = {
    altura: '44px',
    corBorda: Base.AzulBordaCollapse,
  };

  const [exibir, setExibir] = useState(false);

  const key = 'quantidade-nao-frequentaram-ue';

  return (
    <div className="mt-3">
      <CardCollapse
        titulo="Quantidade de crianças/estudantes que não frequentaram a UE nenhuma vez"
        key={`${key}-collapse-key`}
        indice={`${key}-collapse-indice`}
        alt={`${key}-alt`}
        configCabecalho={configCabecalho}
        show={exibir}
        onClick={() => {
          setExibir(!exibir);
        }}
      >
        {exibir && <GraficoQuantidadeNaoFrequentaramUE />}
      </CardCollapse>
    </div>
  );
};

export default QuantidadeNaoFrequentaramUE;
