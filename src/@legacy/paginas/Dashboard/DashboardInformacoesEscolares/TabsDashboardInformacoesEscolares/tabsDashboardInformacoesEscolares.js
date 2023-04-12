import { Tabs } from 'antd';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { ContainerTabsCard } from '~/componentes/tabs/tabs.css';
import { ContainerTabsDashboard } from '../../style';
import GraficosMatriculas from './Matriculas/graficosMatriculas';
import GraficosTurmas from './Turmas/graficosTurmas';

const { TabPane } = Tabs;

const TabsDashboardInformacoesEscolares = props => {
  const { anoLetivo, dreId, ueId, modalidade } = props;

  const [tabSelecionada, setTabSelecionada] = useState(0);

  const TAB_TURMAS = '1';
  const TAB_MATRICULAS = '2';

  const onChangeTab = tabAtiva => setTabSelecionada(tabAtiva);

  const desabilitado = !anoLetivo || !dreId || !ueId || !modalidade;

  useEffect(() => {
    if (!modalidade) {
      setTabSelecionada();
    }
  }, [modalidade]);

  return (
    <ContainerTabsDashboard>
      <ContainerTabsCard
        type="card"
        onChange={onChangeTab}
        activeKey={tabSelecionada}
      >
        <TabPane tab="Turmas" key={TAB_TURMAS} disabled={desabilitado}>
          {tabSelecionada === TAB_TURMAS && (
            <GraficosTurmas
              anoLetivo={anoLetivo}
              dreId={dreId}
              ueId={ueId}
              modalidade={modalidade}
            />
          )}
        </TabPane>
        <TabPane tab="Matrículas" key={TAB_MATRICULAS} disabled={desabilitado}>
          {tabSelecionada === TAB_MATRICULAS && (
            <GraficosMatriculas
              anoLetivo={anoLetivo}
              dreId={dreId}
              ueId={ueId}
              modalidade={modalidade}
            />
          )}
        </TabPane>
      </ContainerTabsCard>
    </ContainerTabsDashboard>
  );
};

TabsDashboardInformacoesEscolares.propTypes = {
  anoLetivo: PropTypes.oneOfType([PropTypes.any]),
  ueId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  dreId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  modalidade: PropTypes.string,
};

TabsDashboardInformacoesEscolares.defaultProps = {
  anoLetivo: null,
  dreId: null,
  ueId: null,
  modalidade: '',
};

export default TabsDashboardInformacoesEscolares;
