import { Row, Tabs } from 'antd';
import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { ContainerTabsCard } from '~/componentes/tabs/style';
import MontarDadosTabSelecionadaInstitucional from './montarDadosTabSelecionadaInstitucional';
import {
  setDadosSecoesEncaminhamentoInstitucional,
  setTabAtivaEncaminhamentoInstitucional,
} from '~/redux/modulos/encaminhamentoInstitucional/actions';
import { erros } from '~/servicos';
import ServicoEncaminhamentoNAAPA from '~/servicos/Paginas/Gestao/NAAPA/ServicoEncaminhamentoNAAPA';
import { TipoQuestionario } from '@/core/enum/tipo-questionario-enum';

const { TabPane } = Tabs;

const MontarDadosTabsInstitucional = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const encaminhamentoId = id || 0;

  const { DreId, UeId, Tipo } = useSelector(
    state => state.encaminhamentoInstitucional.dadosEncaminhamentoInstitucional
  );

  const dadosSecoesEncaminhamento = useSelector(
    store =>
      store.encaminhamentoInstitucional.dadosSecoesEncaminhamentoInstitucional
  );

  const tabAtiva = useSelector(
    store =>
      store.encaminhamentoInstitucional.tabAtivaEncaminhamentoInstitucional
  );

  const obterSecoes = useCallback(async () => {
    const resposta = await ServicoEncaminhamentoNAAPA.obterSecoes(
      encaminhamentoId,
      TipoQuestionario.EncaminhamentoNAAPAInstitucional
    ).catch(e => erros(e));

    const data = resposta?.data || resposta || [];

    dispatch(setDadosSecoesEncaminhamentoInstitucional(data));

    if (!encaminhamentoId) {
      const primeiraTabSelecionada = data?.[0]?.questionarioId?.toString();
      dispatch(setTabAtivaEncaminhamentoInstitucional(primeiraTabSelecionada));
    }
  }, [dispatch, encaminhamentoId]);

  useEffect(() => {
    obterSecoes();
  }, [dispatch, obterSecoes]);

  if (dadosSecoesEncaminhamento?.length === 1) {
    const primeiraSecao = dadosSecoesEncaminhamento[0];
    const questionarioId = primeiraSecao?.questionarioId;

    return (
      <div style={{ marginBottom: 20 }}>
        <MontarDadosTabSelecionadaInstitucional
          questionarioId={questionarioId}
          dadosTab={primeiraSecao}
        />
      </div>
    );
  }

  return (
    <ContainerTabsCard
      border
      type="card"
      onChange={key => dispatch(setTabAtivaEncaminhamentoInstitucional(key))}
      style={{ marginBottom: 20 }}
      activeKey={tabAtiva}
    >
      {dadosSecoesEncaminhamento?.map(tab => {
        const questionarioId = tab?.questionarioId;
        const nomeTab = tab?.nome;

        return (
          <TabPane tab={nomeTab} key={questionarioId}>
            <MontarDadosTabSelecionadaInstitucional
              questionarioId={questionarioId}
              dadosTab={tab}
            />
          </TabPane>
        );
      })}
    </ContainerTabsCard>
  );
};

export default MontarDadosTabsInstitucional;
