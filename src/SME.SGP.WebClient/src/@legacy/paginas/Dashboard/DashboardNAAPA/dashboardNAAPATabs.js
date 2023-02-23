import { Tabs } from 'antd';
import React, { useContext, useState } from 'react';
import { ContainerTabsCard } from '~/componentes/tabs/tabs.css';
import { ModalidadeDTO } from '~/dtos';
import GraficosEvasaoEscolar from './GraficosEvasaoEscolar/graficosEvasaoEscolar';
import NAAPAContext from './naapaContext';

const DashboardNAAPATabs = () => {
  const { anoLetivo, dre, ue, modalidade, semestre } = useContext(NAAPAContext);

  const [tabSelecionada, setTabSelecionada] = useState();

  const EVASAO_ESCOLAR = '1';

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
          {tabSelecionada === EVASAO_ESCOLAR && <GraficosEvasaoEscolar />}
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
          <Tabs.TabPane tab="Evasão Escola" key={EVASAO_ESCOLAR}>
            {montarDados()}
          </Tabs.TabPane>
        </ContainerTabsCard>
      )}
    </>
  );
};

export default DashboardNAAPATabs;
