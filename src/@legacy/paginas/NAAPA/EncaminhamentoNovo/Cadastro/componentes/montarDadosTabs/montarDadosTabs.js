import { Col, Row, Tabs } from 'antd';
import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { ContainerTabsCard } from '~/componentes/tabs/style';
import situacaoNAAPA from '~/dtos/situacaoNAAPA';
import {
  setDadosSecoesEncaminhamentoNAAPA,
  setTabAtivaEncaminhamentoNAAPA,
} from '~/redux/modulos/encaminhamentoNAAPA/actions';
import { erros } from '~/servicos';
import ServicoEncaminhamentoNAAPA from '~/servicos/Paginas/Gestao/NAAPA/ServicoEncaminhamentoNAAPA';
import MontarDadosTabItinerancia from './montarDadosTabItinerancia/montarDadosTabItinerancia';
import MontarDadosTabSelecionada from './montarDadosTabSelecionada';
import { MontarDadosTabBuscaAtiva } from './montarDadosTabBuscaAtiva';
import { Cabecalho } from '~/componentes-sgp';
import './estilo.css';
import { Base } from '~/componentes/colors';

const { TabPane } = Tabs;

const MontarDadosTabs = () => {
  const { aluno, anoLetivo, modalidade } = useSelector(
    state => state.encaminhamentoNAAPA.dadosEncaminhamentoNAAPA
  );
  const dadosSituacao = useSelector(
    state => state.encaminhamentoNAAPA.dadosSituacaoEncaminhamentoNAAPA
  );

  const situacao = dadosSituacao?.situacao;

  const { id } = useParams();
  const dispatch = useDispatch();

  const encaminhamentoId = id || 0;

  const dadosSecoesEncaminhamentoNAAPA = useSelector(
    store => store.encaminhamentoNAAPA.dadosSecoesEncaminhamentoNAAPA
  );

  const tabAtivaEncaminhamentoNAAPA = useSelector(
    store => store.encaminhamentoNAAPA.tabAtivaEncaminhamentoNAAPA
  );

  const obterSecoes = useCallback(async () => {
    const resposta = await ServicoEncaminhamentoNAAPA.obterSecoes(
      encaminhamentoId
    ).catch(e => erros(e));

    dispatch(setDadosSecoesEncaminhamentoNAAPA(resposta?.data || []));
    if (!encaminhamentoId) {
      const primeiraTabSelecionada =
        resposta?.data[0]?.questionarioId?.toString();
      dispatch(setTabAtivaEncaminhamentoNAAPA(primeiraTabSelecionada));
    }
  }, [dispatch, encaminhamentoId]);

  useEffect(() => {
    if (aluno?.codigoAluno && anoLetivo) {
      obterSecoes();
    } else {
      dispatch(setDadosSecoesEncaminhamentoNAAPA([]));
    }
  }, [dispatch, obterSecoes, aluno, anoLetivo]);

  const onChangeTab = tabIndex => {
    ServicoEncaminhamentoNAAPA.validarTrocaDeAbas(tabIndex, encaminhamentoId);
  };

  return (
    <>
      {dadosSecoesEncaminhamentoNAAPA?.map(tab => {
        const questionarioId = tab?.questionarioId;
        const ehTabItinerancia = tab?.nomeComponente === 'QUESTOES_ITINERANCIA';
        const desabilitarTabItinerancia =
          ehTabItinerancia &&
          (!situacao || Number(situacao) === situacaoNAAPA.Rascunho);

        return (
          <div>
            <h1
              style={{ color: Base.CinzaMako }}
              className="titulo-acionamento"
            >
              Acionamento de fluxos
            </h1>

            <p className="p-descricao">
              Insira as informações do encaminhamento
            </p>
            <MontarDadosTabSelecionada
              questionarioId={questionarioId}
              dadosTab={tab}
            />
          </div>
        );
      })}
    </>
  );
};

export default MontarDadosTabs;
