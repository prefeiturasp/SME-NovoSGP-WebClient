import React, { useState } from 'react';
import { Base } from '~/componentes';
import CardCollapse from '~/componentes/cardCollapse';
import MontarDadosPorSecaoRelatorioPAP from '../montarDadosPorSecaoRelatorioPAP';

const CollapseDadosSecaoRelatorioPAP = props => {
  const { dados, index } = props;
  const { nome } = dados;
  const [show, setShow] = useState(true);

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
        onClick={() => setShow(valorAtual => !valorAtual)}
        configCabecalho={configCabecalho}
        show={show}
      >
        <MontarDadosPorSecaoRelatorioPAP dados={dados} />
      </CardCollapse>
    </>
  );
};

export default CollapseDadosSecaoRelatorioPAP;
