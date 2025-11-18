import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { setDadosSecoesPorEtapaDeEncaminhamentoAEE } from '~/redux/modulos/encaminhamentoAEE/actions';
import { erros } from '~/servicos';
import ServicoEncaminhamentoAEE from '~/servicos/Paginas/Relatorios/AEE/ServicoEncaminhamentoAEE';
import MarcadorSituacaoAEE from '../MarcadorSituacaoAEE/marcadorSituacaoAEE';
import AtribuicaoResponsavel from './atribuicaoResponsavel';
import SecaoEncaminhamentoCollapse from './SecaoEncaminhamento/secaoEncaminhamentoCollapse';
import SecaoParecerAEECollapse from './SecaoParecerAEE/secaoParecerAEECollapse';

const MontarDadosSecoes = () => {
  const dispatch = useDispatch();
  const paramsRoute = useParams();

  const encaminhamentoId = paramsRoute?.id || 0;

  const dadosCollapseLocalizarEstudante = useSelector(
    store => store.collapseLocalizarEstudante.dadosCollapseLocalizarEstudante
  );

  const obterSecoesPorEtapaDeEncaminhamentoAEE = useCallback(async () => {
    const resposta =
      await ServicoEncaminhamentoAEE.obterSecoesPorEtapaDeEncaminhamentoAEE(
        encaminhamentoId
      ).catch(e => erros(e));

    if (resposta?.data) {
      dispatch(setDadosSecoesPorEtapaDeEncaminhamentoAEE(resposta.data));
    } else {
      dispatch(setDadosSecoesPorEtapaDeEncaminhamentoAEE([]));
    }
  }, [dispatch, encaminhamentoId]);

  useEffect(() => {
    if (
      dadosCollapseLocalizarEstudante?.codigoAluno &&
      dadosCollapseLocalizarEstudante?.anoLetivo
    ) {
      obterSecoesPorEtapaDeEncaminhamentoAEE();
    } else {
      dispatch(setDadosSecoesPorEtapaDeEncaminhamentoAEE([]));
    }
  }, [
    dispatch,
    dadosCollapseLocalizarEstudante,
    obterSecoesPorEtapaDeEncaminhamentoAEE,
  ]);

  return (
    <>
      <div className="col-md-12 mb-2 d-flex justify-content-end">
        <MarcadorSituacaoAEE />
      </div>
      <div className="col-md-12 mb-2">
        <SecaoEncaminhamentoCollapse />
      </div>
      <div className="col-md-12 mb-2">
        <AtribuicaoResponsavel />
      </div>
      <div className="col-md-12">
        <SecaoParecerAEECollapse />
      </div>
    </>
  );
};

export default MontarDadosSecoes;
