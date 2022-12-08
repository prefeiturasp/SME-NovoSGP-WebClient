import { Row, Tabs } from 'antd';
import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouteMatch } from 'react-router-dom';
import { ContainerTabsCard } from '~/componentes/tabs/tabs.css';
import {
  setDadosSecoesEncaminhamentoNAAPA,
  setTabAtivaEncaminhamentoNAAPA,
} from '~/redux/modulos/encaminhamentoNAAPA/actions';
import { erros } from '~/servicos';
import ServicoNAAPA from '~/servicos/Paginas/Gestao/NAAPA/ServicoNAAPA';
import MontarDadosTabSelecionada from './montarDadosTabSelecionada';

const { TabPane } = Tabs;

const MontarDadosTabs = () => {
  const { aluno, anoLetivo, modalidade } = useSelector(
    state => state.encaminhamentoNAAPA.dadosEncaminhamentoNAAPA
  );

  const routeMatch = useRouteMatch();
  const dispatch = useDispatch();

  const encaminhamentoId = routeMatch?.params?.id || 0;

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
  }, [dispatch, encaminhamentoId, modalidade]);

  useEffect(() => {
    if (aluno?.codigoAluno && anoLetivo) {
      obterSecoes();
    } else {
      dispatch(setDadosSecoesEncaminhamentoNAAPA([]));
    }
  }, [dispatch, obterSecoes, aluno, anoLetivo]);

  const onChangeTab = tabIndex => {
    dispatch(setTabAtivaEncaminhamentoNAAPA(tabIndex));
  };

  return (
    <>
      <ContainerTabsCard
        border
        type="card"
        onChange={onChangeTab}
        activeKey={tabAtivaEncaminhamentoNAAPA}
      >
        {dadosSecoesEncaminhamentoNAAPA?.map(tab => {
          const questionarioId = tab?.questionarioId;
          const nomeTab = tab?.nome;

          return (
            <TabPane tab={nomeTab} key={questionarioId}>
              <MontarDadosTabSelecionada
                questionarioId={questionarioId}
                dadosTab={tab}
              />
            </TabPane>
          );
        })}
      </ContainerTabsCard>

      {!tabAtivaEncaminhamentoNAAPA && (
        <Row type="flex" justify="center" style={{ marginTop: 20 }}>
          Selecione uma aba
        </Row>
      )}
    </>
  );
};

export default MontarDadosTabs;
