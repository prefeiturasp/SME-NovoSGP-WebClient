import React, { useState } from 'react';
import { Tabs } from 'antd';
import { useSelector } from 'react-redux';

import { ModalidadeEnum } from '@/core/enum/modalidade-enum';

import GraficosFrequencia from '../DadosDashboardFrequencia/graficosFrequencia';
import GraficoCompensacaoAusencia from '../DadosDashboardCompensacaoAusencia/graficoCompensacaoAusencia';

import { ContainerTabsCard } from '~/componentes/tabs/tabs.css';
import { ContainerTabsDashboardFrequencia } from '../dashboardFrequencia.css';

const TabsDashboardFrequencia = () => {
  const [tabSelecionada, setTabSelecionada] = useState(0);
  const anoLetivo = useSelector(
    store => store.dashboardFrequencia?.dadosDashboardFrequencia?.anoLetivo
  );
  const dre = useSelector(
    store => store.dashboardFrequencia?.dadosDashboardFrequencia?.dre
  );
  const ue = useSelector(
    store => store.dashboardFrequencia?.dadosDashboardFrequencia?.ue
  );
  const modalidade = useSelector(
    store => store.dashboardFrequencia?.dadosDashboardFrequencia?.modalidade
  );
  const semestre = useSelector(
    store => store.dashboardFrequencia?.dadosDashboardFrequencia?.semestre
  );

  const ehModalidadeEJAouCelp =
    Number(modalidade) === ModalidadeEnum.EJA ||
    Number(modalidade) === ModalidadeEnum.CELP;
  const ehModalidadeInfatil = Number(modalidade) === ModalidadeEnum.INFANTIL;
  const semestreDesabilitado = !!(ehModalidadeEJAouCelp ? semestre : !semestre);
  const exibirAbas =
    anoLetivo && dre && ue && modalidade && semestreDesabilitado;

  const montarDados = () => {
    return (
      <>
        <div className="col-md-12 p-0">
          {tabSelecionada === '1' && <GraficosFrequencia />}
          {tabSelecionada === '2' && <GraficoCompensacaoAusencia />}
        </div>
      </>
    );
  };

  const onChangeTab = tabAtiva => {
    setTabSelecionada(tabAtiva);
  };

  return (
    <>
      {exibirAbas && (
        <ContainerTabsDashboardFrequencia>
          <ContainerTabsCard
            width="auto"
            type="card"
            onChange={onChangeTab}
            activeKey={tabSelecionada}
          >
            <Tabs.TabPane tab="Frequência" key="1">
              {montarDados()}
            </Tabs.TabPane>
            {!ehModalidadeInfatil && (
              <Tabs.TabPane tab="Compensação de ausência" key="2">
                {montarDados()}
              </Tabs.TabPane>
            )}
          </ContainerTabsCard>
        </ContainerTabsDashboardFrequencia>
      )}
    </>
  );
};

export default TabsDashboardFrequencia;
