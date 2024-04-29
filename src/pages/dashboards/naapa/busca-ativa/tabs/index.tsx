import { Col, Row, Tabs } from 'antd';
import React, { useState } from 'react';
import { ContainerTabsCard } from '~/componentes/tabs/style';
import { GraficoQuantidadeBuscaAtivaPorMotivosAusencia } from './grafico-motivos-ausencias';
import { GraficoQuantidadeBuscaAtivaPorProcedimentosTrabalhoDre } from './grafico-procedimentos-trabalho';
import { GraficoQuantidadeBuscaAtivaPorReflexoFrequenciaMes } from './grafico-reflexos-percentual-frequencia';

enum TabsBuscaAtiva {
  MOTIVOS_AUSENCIA = '1',
  PROCEDIMENTOS_TRABALHO = '2',
  REFLEXOS_PERCENTUAL_FREQUENCA = '3',
}

export const DashboardBuscaAtivaTabs: React.FC = () => {
  const [tabSelecionada, setTabSelecionada] = useState('');

  const montarDadosPorTabSelecionada = () => {
    switch (tabSelecionada) {
      case TabsBuscaAtiva.MOTIVOS_AUSENCIA:
        return <GraficoQuantidadeBuscaAtivaPorMotivosAusencia />;
      case TabsBuscaAtiva.PROCEDIMENTOS_TRABALHO:
        return <GraficoQuantidadeBuscaAtivaPorProcedimentosTrabalhoDre />;
      case TabsBuscaAtiva.REFLEXOS_PERCENTUAL_FREQUENCA:
        return <GraficoQuantidadeBuscaAtivaPorReflexoFrequenciaMes />;

      default:
        return <></>;
    }
  };

  const onChangeTab = (tabAtiva: string) => {
    setTabSelecionada(tabAtiva);
  };

  return (
    <Col span={24}>
      <Row gutter={[16, 16]}>
        <Col sm={24}>
          <>
            <ContainerTabsCard type="card" onChange={onChangeTab} activeKey={tabSelecionada}>
              <Tabs.TabPane tab="Motivos da ausência" key={TabsBuscaAtiva.MOTIVOS_AUSENCIA}>
                {montarDadosPorTabSelecionada()}
              </Tabs.TabPane>
              <Tabs.TabPane
                tab="Procedimentos de trabalho"
                key={TabsBuscaAtiva.PROCEDIMENTOS_TRABALHO}
              >
                {montarDadosPorTabSelecionada()}
              </Tabs.TabPane>
              <Tabs.TabPane
                tab="Reflexos no percentual de frequência"
                key={TabsBuscaAtiva.REFLEXOS_PERCENTUAL_FREQUENCA}
              >
                {montarDadosPorTabSelecionada()}
              </Tabs.TabPane>
            </ContainerTabsCard>

            {!tabSelecionada ? <Row justify="center">Selecione uma tab</Row> : <></>}
          </>
        </Col>
      </Row>
    </Col>
  );
};
