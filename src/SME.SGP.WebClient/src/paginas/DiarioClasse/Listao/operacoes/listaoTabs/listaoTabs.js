import { Col, Tabs } from 'antd';
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

  const montarDados = () => {
    let elementoAtual = <></>;

    switch (tabAtual) {
      case LISTAO_TAB_FREQUENCIA:
        elementoAtual = <TabListaoFrequencia />;
        break;
      case LISTAO_TAB_PLANO_AULA:
        elementoAtual = <TabListaoPlanoAula />;
        break;
      case LISTAO_TAB_AVALIACOES:
        elementoAtual = <TabListaoAvaliacoes />;
        break;
      case LISTAO_TAB_FECHAMENTO:
        elementoAtual = <TabListaoFechamento />;
        break;

      case LISTAO_TAB_DIARIO_BORDO:
        elementoAtual = <TabListaoDiarioBordo />;
        break;

      default:
        break;
    }
    return <Col span={24}>{elementoAtual}</Col>;
  };

  const onChangeTab = tabAtiva => setTabAtual(tabAtiva);

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
            {montarDados()}
          </TabPane>
        </ContainerTabsCard>
      );
    }

    if (modalidade === String(ModalidadeDTO.INFANTIL)) {
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
            {montarDados()}
          </TabPane>
          <TabPane
            tab="Diário de bordo"
            key={LISTAO_TAB_DIARIO_BORDO}
            disabled={desabilitarTabs}
          >
            {montarDados()}
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
          {montarDados()}
        </TabPane>
        <TabPane
          tab="Plano de aula"
          key={LISTAO_TAB_PLANO_AULA}
          disabled={desabilitarTabs}
        >
          {montarDados()}
        </TabPane>
        <TabPane
          tab="Avaliações"
          key={LISTAO_TAB_AVALIACOES}
          disabled={desabilitarTabs}
        >
          {montarDados()}
        </TabPane>
        <TabPane
          tab="Fechamento"
          key={LISTAO_TAB_FECHAMENTO}
          disabled={desabilitarTabs}
        >
          {montarDados()}
        </TabPane>
      </ContainerTabsCard>
    );
  };

  return montarTabs();
};

export default ListaoTabs;
