import React, { useState, memo } from 'react';
import { Base } from '~/componentes';
import CardCollapse from '~/componentes/cardCollapse';
import GraficoQtdAtendimentosEncaminhamentosProfissional from './graficoQtdAtendimentosEncaminhamentosProfissional';

const QtdAtendimentosEncaminhamentosProfissional = () => {
  const configCabecalho = {
    altura: '44px',
    corBorda: Base.AzulBordaCollapse,
  };

  const [exibir, setExibir] = useState(false);

  const key = 'quantidade-atendimento-encaminhamentos-naapa-profissional';

  return (
    <div className="mt-3">
      <CardCollapse
        titulo="Quantidade de atendimentos de encaminhamento NAAPA por profissional"
        key={`${key}-collapse-key`}
        indice={`${key}-collapse-indice`}
        alt={`${key}-alt`}
        configCabecalho={configCabecalho}
        show={exibir}
        onClick={() => {
          setExibir(!exibir);
        }}
      >
        {exibir && <GraficoQtdAtendimentosEncaminhamentosProfissional />}
      </CardCollapse>
    </div>
  );
};

export default memo(QtdAtendimentosEncaminhamentosProfissional);
