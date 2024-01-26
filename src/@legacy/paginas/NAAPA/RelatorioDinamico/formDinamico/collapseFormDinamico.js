import React from 'react';
import { Base } from '~/componentes';
import CardCollapse from '~/componentes/cardCollapse';
import RelatorioDinamicoQuestionarioDinamico from './relatorioDinamicoQuestionarioDinamico';

const CollapseRelatorioDinamicoNAAPAFormDinamico = props => {
  const { secao, index, questoes, dadosSecoes } = props;
  const { nome } = secao;

  const configCabecalho = {
    altura: '50px',
    corBorda: Base.AzulBordaCard,
  };

  return (
    <>
      <CardCollapse
        key={`secao-${index}-collapse-key`}
        titulo={nome}
        indice={`secao-${index}-collapse-indice`}
        alt={`secao-${index}-alt`}
        configCabecalho={configCabecalho}
        show
      >
        <RelatorioDinamicoQuestionarioDinamico
          secao={secao}
          questoes={questoes}
          dadosSecoes={dadosSecoes}
        />
      </CardCollapse>
    </>
  );
};

export default React.memo(CollapseRelatorioDinamicoNAAPAFormDinamico);
