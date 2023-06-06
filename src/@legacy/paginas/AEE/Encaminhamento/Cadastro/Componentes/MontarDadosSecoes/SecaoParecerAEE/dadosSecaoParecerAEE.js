import React from 'react';
import { useSelector } from 'react-redux';
import MontarDadosPorSecao from '../montarDadosPorSecao';
import shortid from 'shortid';

const DadosSecaoParecerAEE = () => {
  const dadosCollapseLocalizarEstudante = useSelector(
    store => store.collapseLocalizarEstudante.dadosCollapseLocalizarEstudante
  );

  const dadosSecoesPorEtapaDeEncaminhamentoAEE = useSelector(
    store => store.encaminhamentoAEE.dadosSecoesPorEtapaDeEncaminhamentoAEE
  );

  return dadosCollapseLocalizarEstudante?.codigoAluno &&
    dadosSecoesPorEtapaDeEncaminhamentoAEE?.length ? (
    dadosSecoesPorEtapaDeEncaminhamentoAEE
      .filter(d => d.etapa === 3)
      .map(item => {
        return <MontarDadosPorSecao dados={item} key={shortid.generate()} />;
      })
  ) : (
    <></>
  );
};

export default DadosSecaoParecerAEE;
