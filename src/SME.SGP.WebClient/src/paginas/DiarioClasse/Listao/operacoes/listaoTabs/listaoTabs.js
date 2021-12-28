import { Tabs } from 'antd';
import React, { useContext, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { ContainerTabsCard } from '~/componentes/tabs/tabs.css';
import { BIMESTRE_FINAL } from '~/constantes';
import { ModalidadeDTO } from '~/dtos';
import { ehTurmaInfantil } from '~/servicos';
import {
  LISTAO_TAB_AVALIACOES,
  LISTAO_TAB_DIARIO_BORDO,
  LISTAO_TAB_FECHAMENTO,
  LISTAO_TAB_FREQUENCIA,
  LISTAO_TAB_PLANO_AULA,
} from '../../listaoConstantes';
import ListaoContext from '../../listaoContext';
import { onChangeTabListao } from '../../listaoFuncoes';
import TabListaoDiarioBordo from './tabDiarioBordo/tabListaoDiarioBordo';
import TabListaoFechamento from './tabFechamento/tabListaoFechamento';
import TabListaoFrequencia from './tabFrequencia/tabListaoFrequencia';
import TabListaoAvaliacoes from './tabListaoAvaliacoes/tabListaoAvaliacoes';
import TabListaoPlanoAula from './tabPlanoAula/tabListaoPlanoAula';

const { TabPane } = Tabs;

const ListaoTabs = () => {
  const usuario = useSelector(store => store.usuario);
  const { turmaSelecionada } = usuario;
  const { modalidade } = turmaSelecionada;

  const modalidadesFiltroPrincipal = useSelector(
    state => state.filtro.modalidades
  );

  const {
    tabAtual,
    setTabAtual,
    bimestreOperacoes,
    componenteCurricular,
    setListaoEhInfantil,
  } = useContext(ListaoContext);

  useEffect(() => {
    const ehInfantil = ehTurmaInfantil(
      modalidadesFiltroPrincipal,
      turmaSelecionada
    );
    setListaoEhInfantil(ehInfantil);
  }, [modalidadesFiltroPrincipal, turmaSelecionada]);

  const desabilitarTabs = !componenteCurricular || !bimestreOperacoes;

  const onChangeTab = tabAtiva => onChangeTabListao(tabAtiva, setTabAtual);

  const montarTabs = () => {
    const ehBimestreFinal = bimestreOperacoes === String(BIMESTRE_FINAL);

    if (ehBimestreFinal) {
      return (
        <ContainerTabsCard
          type="card"
          onChange={onChangeTab}
          activeKey={tabAtual}
        >
          <TabPane
            tab="Fechamento"
            key={LISTAO_TAB_FECHAMENTO}
            disabled={desabilitarTabs}
          >
            {tabAtual === LISTAO_TAB_FECHAMENTO ? (
              <TabListaoFechamento />
            ) : (
              <></>
            )}
          </TabPane>
        </ContainerTabsCard>
      );
    }

    if (Number(modalidade) === ModalidadeDTO.INFANTIL) {
      return (
        <ContainerTabsCard
          type="card"
          onChange={onChangeTab}
          activeKey={tabAtual}
        >
          <TabPane
            tab="Frequência"
            key={LISTAO_TAB_FREQUENCIA}
            disabled={desabilitarTabs}
          >
            {tabAtual === LISTAO_TAB_FREQUENCIA ? (
              <TabListaoFrequencia />
            ) : (
              <></>
            )}
          </TabPane>
          <TabPane
            tab="Diário de bordo"
            key={LISTAO_TAB_DIARIO_BORDO}
            disabled={desabilitarTabs}
          >
            {tabAtual === LISTAO_TAB_DIARIO_BORDO ? (
              <TabListaoDiarioBordo />
            ) : (
              <></>
            )}
          </TabPane>
        </ContainerTabsCard>
      );
    }

    return (
      <ContainerTabsCard
        type="card"
        onChange={onChangeTab}
        activeKey={tabAtual}
      >
        <TabPane
          tab="Frequência"
          key={LISTAO_TAB_FREQUENCIA}
          disabled={desabilitarTabs}
        >
          {tabAtual === LISTAO_TAB_FREQUENCIA ? <TabListaoFrequencia /> : <></>}
        </TabPane>
        <TabPane
          tab="Plano de aula"
          key={LISTAO_TAB_PLANO_AULA}
          disabled={desabilitarTabs}
        >
          {tabAtual === LISTAO_TAB_PLANO_AULA ? <TabListaoPlanoAula /> : <></>}
        </TabPane>
        <TabPane
          tab="Avaliações"
          key={LISTAO_TAB_AVALIACOES}
          disabled={desabilitarTabs}
        >
          {tabAtual === LISTAO_TAB_AVALIACOES ? <TabListaoAvaliacoes /> : <></>}
        </TabPane>
        <TabPane
          tab="Fechamento"
          key={LISTAO_TAB_FECHAMENTO}
          disabled={desabilitarTabs}
        >
          {tabAtual === LISTAO_TAB_FECHAMENTO ? <TabListaoFechamento /> : <></>}
        </TabPane>
      </ContainerTabsCard>
    );
  };

  return montarTabs();
};

export default ListaoTabs;
