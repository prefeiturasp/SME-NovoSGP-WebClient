import React, { useState } from 'react';
import PropTypes from 'prop-types';
import CardCollapse from '~/componentes/cardCollapse';
import { Base } from '~/componentes';
import PainelFrequenciaBase from '~/paginas/Gestao/InformacoesEducacionais/shared/PainelFrequenciaBase';
import '~/paginas/Gestao/InformacoesEducacionais/shared/painelFrequenciaBase.css';

export default function PainelFrequenciaUe({ ueCodigo, anoLetivo, nomeUe }) {
  const [exibirCard, setExibirCard] = useState(false);

  const configCabecalho = {
    altura: '44px',
    corBorda: Base.AzulBordaCollapse,
  };
  const key = 'painel-frequencia-ue';

  return (
    <CardCollapse
      titulo="Frequência"
      show={exibirCard}
      onClick={() => setExibirCard(!exibirCard)}
      configCabecalho={configCabecalho}
      key={`${key}-collapse-key`}
      indice={`${key}-collapse-indice`}
    >
      <div className="painel-frequencia painel-frequencia-padding">
        <div className="painel-frequencia-introducao">
          <h2 className="painel-frequencia-titulo">Média de frequência</h2>
          <p className="painel-frequencia-descricao">
            O gráfico representa a média de frequência semanal dos alunos da{' '}
            <strong>{nomeUe}</strong> no último mês
          </p>
        </div>
        <PainelFrequenciaBase
          tipoExtra="ue"
          codigo={ueCodigo}
          anoLetivo={anoLetivo}
        />
      </div>
    </CardCollapse>
  );
}

PainelFrequenciaUe.propTypes = {
  ueCodigo: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  anoLetivo: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

PainelFrequenciaUe.defaultProps = {
  ueCodigo: null,
  anoLetivo: null,
};
