import React, { useState } from 'react';
import { Tabs } from 'antd';
import { useSelector } from 'react-redux';

import { ModalidadeDTO } from '~/dtos';
import { ContainerTabsDashboardFechamento } from '../dashboardFechamento.css';
import { ContainerTabsCard } from '~/componentes/tabs/tabs.css';

const TabsDashboardFechamento = () => {
  const [tabSelecionada, setTabSelecionada] = useState();
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
  const semestre = useSelector(
    store => store.dashboardFechamento?.dadosDashboardFechamento?.semestre
  );

  const ehModalidadeEJA = Number(modalidade) === ModalidadeDTO.EJA;
  const semestreDesabilitado = !!(ehModalidadeEJA ? semestre : !semestre);
  const exibirAbas =
    anoLetivo && dre && ue && modalidade && semestreDesabilitado;

  const onChangeTab = tabAtiva => {
    setTabSelecionada(tabAtiva);
  };

  return (
    <>
      {exibirAbas && (
        <ContainerTabsDashboardFechamento>
          <ContainerTabsCard
            type="card"
            onChange={onChangeTab}
            activeKey={tabSelecionada}
          >
            <Tabs.TabPane tab="Fechamento" key="1">
              <div></div>
            </Tabs.TabPane>
          </ContainerTabsCard>
        </ContainerTabsDashboardFechamento>
      )}
    </>
  );
};

export default TabsDashboardFechamento;
