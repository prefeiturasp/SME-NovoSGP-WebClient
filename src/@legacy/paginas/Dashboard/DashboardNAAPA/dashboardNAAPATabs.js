import { Tabs } from 'antd';
import React, { useContext, useState } from 'react';
import { ContainerTabsCard } from '~/componentes/tabs/tabs.css';
import { ModalidadeDTO } from '~/dtos';
import GraficosEvasaoEscolar from './GraficosEvasaoEscolar/graficosEvasaoEscolar';
import NAAPAContext from './naapaContext';

const DashboardNAAPATabs = () => {
  const { anoLetivo, dre, ue, modalidade, semestre } = useContext(NAAPAContext);

  const [tabSelecionada, setTabSelecionada] = useState();

  const RISCO_ABANDONO = '1';

  const ehModalidadeEJA = Number(modalidade) === ModalidadeDTO.EJA;
  const exibirAbas =
    anoLetivo &&
    dre?.codigo &&
    ue?.codigo &&
    modalidade &&
    (ehModalidadeEJA ? !!semestre : true);

  const montarDados = () => {
    return (
      <>
        <div className="col-md-12 p-0">
          {tabSelecionada === RISCO_ABANDONO && <GraficosEvasaoEscolar />}
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
        <ContainerTabsCard
          type="card"
          onChange={onChangeTab}
          activeKey={tabSelecionada}
        >
          <Tabs.TabPane tab="Risco de abandono" key={RISCO_ABANDONO}>
            {montarDados()}
          </Tabs.TabPane>
        </ContainerTabsCard>
      )}
    </>
  );
};

export default DashboardNAAPATabs;
