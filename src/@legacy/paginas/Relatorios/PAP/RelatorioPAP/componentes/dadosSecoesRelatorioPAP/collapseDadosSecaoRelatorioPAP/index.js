import React from 'react';
import { Base } from '~/componentes';
import CardCollapse from '~/componentes/cardCollapse';
import MontarDadosPorSecaoRelatorioPAP from '../montarDadosPorSecaoRelatorioPAP';

const CollapseDadosSecaoRelatorioPAP = props => {
  const { dados, index } = props;
  const { nome } = dados;

  const configCabecalho = {
    altura: '50px',
    corBorda: Base.AzulBordaCard,
  };

  const onClickCardCollapse = () => {};

  return (
    <>
      <CardCollapse
        key={`secao-${index}-collapse-key`}
        titulo={nome}
        indice={`secao-${index}-collapse-indice`}
        alt={`secao-${index}-alt`}
        onClick={onClickCardCollapse}
        configCabecalho={configCabecalho}
        show
      >
        <MontarDadosPorSecaoRelatorioPAP dados={dados} />
      </CardCollapse>
    </>
  );
};

export default CollapseDadosSecaoRelatorioPAP;
