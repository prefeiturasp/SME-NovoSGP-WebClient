import { Tabs } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouteMatch } from 'react-router-dom';
import { ContainerTabsCard } from '~/componentes/tabs/tabs.css';
import { setDadosSecoesEncaminhamentoNAAPA } from '~/redux/modulos/encaminhamentoNAAPA/actions';
import { erros } from '~/servicos';
import ServicoNAAPA from '~/servicos/Paginas/Gestao/NAAPA/ServicoNAAPA';
import MontarDadosTabSelecionada from './montarDadosTabSelecionada';

const { TabPane } = Tabs;

const MontarDadosTabs = () => {
  const { aluno, anoLetivo } = useSelector(
    state => state.encaminhamentoNAAPA.dadosEncaminhamentoNAAPA
  );

  const routeMatch = useRouteMatch();
  const dispatch = useDispatch();

  const encaminhamentoId = routeMatch?.params?.id || 0;

  const [tabAtiva, setTabAtiva] = useState();

  const dadosSecoesEncaminhamentoNAAPA = useSelector(
    store => store.encaminhamentoNAAPA.dadosSecoesEncaminhamentoNAAPA
  );

  const obterSecoes = useCallback(async () => {
    const resposta = await ServicoNAAPA.obterSecoes(encaminhamentoId).catch(e =>
      erros(e)
    );

    dispatch(setDadosSecoesEncaminhamentoNAAPA(resposta?.data || []));
  }, [dispatch, encaminhamentoId]);

  useEffect(() => {
    if (aluno?.codigoAluno && anoLetivo) {
      obterSecoes();
    } else {
      dispatch(setDadosSecoesEncaminhamentoNAAPA([]));
    }
  }, [dispatch, obterSecoes, aluno, anoLetivo]);

  const onChangeTab = tabIndex => {
    setTabAtiva(tabIndex);
  };

  return (
    <ContainerTabsCard type="card" onChange={onChangeTab} activeKey={tabAtiva}>
      {dadosSecoesEncaminhamentoNAAPA?.map(tab => {
        const questionarioId = tab?.questionarioId;
        const nomeTab = tab?.nome;

        return (
          <TabPane tab={nomeTab} key={questionarioId}>
            {questionarioId?.toString() === tabAtiva && (
              <MontarDadosTabSelecionada
                questionarioId={questionarioId}
                dadosTab={tab}
              />
            )}
          </TabPane>
        );
      })}
    </ContainerTabsCard>
  );
};

export default MontarDadosTabs;