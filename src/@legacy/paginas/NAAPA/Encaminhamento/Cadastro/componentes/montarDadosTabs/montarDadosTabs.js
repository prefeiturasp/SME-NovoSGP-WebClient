import { Row, Tabs } from 'antd';
import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { ContainerTabsCard } from '~/componentes/tabs/tabs.css';
import situacaoNAAPA from '~/dtos/situacaoNAAPA';
import {
  setDadosSecoesEncaminhamentoNAAPA,
  setTabAtivaEncaminhamentoNAAPA,
} from '~/redux/modulos/encaminhamentoNAAPA/actions';
import { erros } from '~/servicos';
import ServicoNAAPA from '~/servicos/Paginas/Gestao/NAAPA/ServicoNAAPA';
import MontarDadosTabItinerancia from './montarDadosTabItinerancia/montarDadosTabItinerancia';
import MontarDadosTabSelecionada from './montarDadosTabSelecionada';

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
    const resposta = await ServicoNAAPA.obterSecoes(
      encaminhamentoId,
      modalidade
    ).catch(e => erros(e));

    dispatch(setDadosSecoesEncaminhamentoNAAPA(resposta?.data || []));
    if (!encaminhamentoId) {
      const primeiraTabSelecionada =
        resposta?.data[0]?.questionarioId?.toString();
      dispatch(setTabAtivaEncaminhamentoNAAPA(primeiraTabSelecionada));
    }
  }, [dispatch, encaminhamentoId, modalidade]);

  useEffect(() => {
    if (aluno?.codigoAluno && anoLetivo) {
      obterSecoes();
    } else {
      dispatch(setDadosSecoesEncaminhamentoNAAPA([]));
    }
  }, [dispatch, obterSecoes, aluno, anoLetivo]);

  const onChangeTab = tabIndex => {
    ServicoNAAPA.validarTrocaDeAbas(tabIndex, encaminhamentoId);
  };

  return (
    <>
      <ContainerTabsCard
        border
        type="card"
        onChange={onChangeTab}
        style={{ marginBottom: 20 }}
        activeKey={tabAtivaEncaminhamentoNAAPA}
      >
        {dadosSecoesEncaminhamentoNAAPA?.map(tab => {
          const questionarioId = tab?.questionarioId;
          const nomeTab = tab?.nome;
          const ehTabItinerancia =
            tab?.nomeComponente === 'QUESTOES_ITINERANCIA';
          const desabilitarTabItinerancia =
            ehTabItinerancia &&
            (!situacao || Number(situacao) === situacaoNAAPA.Rascunho);

          return (
            <TabPane
              tab={nomeTab}
              key={questionarioId}
              disabled={desabilitarTabItinerancia}
            >
              {ehTabItinerancia ? (
                <MontarDadosTabItinerancia
                  questionarioId={questionarioId}
                  dadosTab={tab}
                />
              ) : (
                <MontarDadosTabSelecionada
                  questionarioId={questionarioId}
                  dadosTab={tab}
                />
              )}
            </TabPane>
          );
        })}
      </ContainerTabsCard>

      {!tabAtivaEncaminhamentoNAAPA && (
        <Row
          type="flex"
          justify="center"
          style={{ marginTop: 20, marginBottom: 36 }}
        >
          Selecione uma aba
        </Row>
      )}
    </>
  );
};

export default MontarDadosTabs;
