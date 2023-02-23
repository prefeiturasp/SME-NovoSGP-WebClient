import React, { useState } from 'react';
import { Base } from '~/componentes';
import CardCollapse from '~/componentes/cardCollapse';
import GraficoQuantidadeFrequenciaInferior from './graficoQuantidadeFrequenciaInferior';

const QuantidadeFrequenciaInferior = () => {
  const configCabecalho = {
    altura: '44px',
    corBorda: Base.AzulBordaCollapse,
  };

  const [exibir, setExibir] = useState(false);

  const key = 'quantidade-frequencia-inferior';

  return (
    <div className="mt-3">
      <CardCollapse
        titulo="Quantidade de crianças/estudantes com frequência inferior a 50%"
        key={`${key}-collapse-key`}
        indice={`${key}-collapse-indice`}
        alt={`${key}-alt`}
        configCabecalho={configCabecalho}
        show={exibir}
        onClick={() => {
          setExibir(!exibir);
        }}
      >
        {exibir && <GraficoQuantidadeFrequenciaInferior />}
      </CardCollapse>
    </div>
  );
};

export default QuantidadeFrequenciaInferior;
