import React, { useState } from 'react';
import { Tabs } from 'antd';
import { useSelector } from 'react-redux';

import { ModalidadeDTO } from '~/dtos';

import GraficosFechamento from '../DadosDashboardFechamento/Fechamento/graficosFechamento';
import GraficoSituacaoConselhoClasse from '../DadosDashboardFechamento/ConselhoClasse/graficosConselhoClasse';

import { ContainerTabsDashboardFechamento } from '../dashboardFechamento.css';
import { ContainerTabsCard } from '~/componentes/tabs/tabs.css';

const TabsDashboardFechamento = () => {
  const [tabSelecionada, setTabSelecionada] = useState(0);
  const anoLetivo = useSelector(
    store => store.dashboardFechamento?.dadosDashboardFechamento?.anoLetivo
  );
  const dre = useSelector(
    store => store.dashboardFechamento?.dadosDashboardFechamento?.dre
  );
  const ue = useSelector(
    store => store.dashboardFechamento?.dadosDashboardFechamento?.ue
  );
  const modalidade = useSelector(
    store => store.dashboardFechamento?.dadosDashboardFechamento?.modalidade
  );
  const bimestre = useSelector(
    store => store.dashboardFechamento?.dadosDashboardFechamento?.bimestre
  );
  const semestre = useSelector(
    store => store.dashboardFechamento?.dadosDashboardFechamento?.semestre
  );

  const ehModalidadeEJA = Number(modalidade) === ModalidadeDTO.EJA;
  const semestreDesabilitado = !!(ehModalidadeEJA ? semestre : !semestre);
  const exibirAbas =
    anoLetivo &&
    dre &&
    ue &&
    modalidade &&
    bimestre &&
    semestreDesabilitado &&
    String(modalidade) !== String(ModalidadeDTO.INFANTIL);

  const onChangeTab = tabAtiva => {
    setTabSelecionada(tabAtiva);
  };

  const montarDados = () => {
    return (
      <>
        <div className="col-md-12 p-0">
          {tabSelecionada === '1' && <GraficosFechamento />}
          {tabSelecionada === '2' && <GraficoSituacaoConselhoClasse />}
        </div>
      </>
    );
  };

  return (
    <>
      {exibirAbas && (
        <ContainerTabsDashboardFechamento>
          <ContainerTabsCard
            width="auto"
            type="card"
            onChange={onChangeTab}
            activeKey={tabSelecionada}
          >
            <Tabs.TabPane tab="Fechamento" key="1">
              {montarDados()}
            </Tabs.TabPane>
            <Tabs.TabPane tab="Conselho de classe" key="2">
              {montarDados()}
            </Tabs.TabPane>
          </ContainerTabsCard>
        </ContainerTabsDashboardFechamento>
      )}
    </>
  );
};

export default TabsDashboardFechamento;
