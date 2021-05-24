import { Tabs } from 'antd';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { ContainerTabsCard } from '~/componentes/tabs/tabs.css';
import { OPCAO_TODOS } from '~/constantes/constantes';
import { ContainerTabsDashboard } from '../../style';
import GraficosMatriculas from './Matriculas/graficosMatriculas';
import GraficosTurmas from './Turmas/graficosTurmas';

const { TabPane } = Tabs;

const TabsDashboardInformacoesEscolares = props => {
  const { anoLetivo, dreId, ueId, modalidade, listaAnosEscolares } = props;

  const [tabSelecionada, setTabSelecionada] = useState();

  const TAB_TURMAS = '1';
  const TAB_MATRICULAS = '2';

  const onChangeTab = tabAtiva => setTabSelecionada(tabAtiva);

  return (
    <ContainerTabsDashboard>
      <ContainerTabsCard
        type="card"
        onChange={onChangeTab}
        activeKey={tabSelecionada}
      >
        <TabPane tab="Turmas" key={TAB_TURMAS}>
          {tabSelecionada === TAB_TURMAS && (
            <GraficosTurmas
              anoLetivo={anoLetivo}
              dreId={dreId}
              ueId={ueId}
              modalidade={modalidade}
              listaAnosEscolares={listaAnosEscolares}
              exibirAnosEscolares={
                anoLetivo &&
                modalidade &&
                dreId === OPCAO_TODOS &&
                ueId === OPCAO_TODOS
              }
            />
          )}
        </TabPane>
        <TabPane tab="Matrículas" key={TAB_MATRICULAS}>
          {tabSelecionada === TAB_MATRICULAS && (
            <GraficosMatriculas
              anoLetivo={anoLetivo}
              dreId={dreId}
              ueId={ueId}
              modalidade={modalidade}
              listaAnosEscolares={listaAnosEscolares}
              exibirAnosEscolares={
                anoLetivo &&
                modalidade &&
                ((dreId === OPCAO_TODOS && ueId === OPCAO_TODOS) ||
                  (dreId !== OPCAO_TODOS && ueId !== OPCAO_TODOS))
              }
            />
          )}
        </TabPane>
      </ContainerTabsCard>
    </ContainerTabsDashboard>
  );
};

TabsDashboardInformacoesEscolares.propTypes = {
  anoLetivo: PropTypes.oneOfType(PropTypes.any),
  ueId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  dreId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  modalidade: PropTypes.string,
  listaAnosEscolares: PropTypes.oneOfType(PropTypes.array),
};

TabsDashboardInformacoesEscolares.defaultProps = {
  anoLetivo: null,
  dreId: null,
  ueId: null,
  modalidade: '',
  listaAnosEscolares: [],
};

export default TabsDashboardInformacoesEscolares;
