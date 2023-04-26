import { Tabs } from 'antd';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { ContainerTabsCard } from '~/componentes/tabs/tabs.css';
import { ContainerTabsDashboard } from '../../style';
import GraficosAcompanhamentoAprendizagem from './Graficos/graficosAcompAprend';

const { TabPane } = Tabs;

const TabsDashboardRelAcompanhamentoAprendizagem = props => {
  const { anoLetivo, dreId, ueId, dataUltimaConsolidacao } = props;

  const [tabSelecionada, setTabSelecionada] = useState(0);

  const TAB_ACOMPANHAMENTO_APRENDIZAGEM = '1';

  useEffect(() => {
    if (anoLetivo && dreId && ueId) {
      setTabSelecionada(TAB_ACOMPANHAMENTO_APRENDIZAGEM);
    } else {
      setTabSelecionada();
    }
  }, [anoLetivo, dreId, ueId]);

  const onChangeTab = tabAtiva => {
    setTabSelecionada(tabAtiva);
  };

  return (
    <>
      {anoLetivo && dreId && ueId ? (
        <ContainerTabsDashboard>
          <ContainerTabsCard
            type="card"
            onChange={onChangeTab}
            activeKey={tabSelecionada}
          >
            <TabPane
              tab="Acompanhamento da Aprendizagem"
              key={TAB_ACOMPANHAMENTO_APRENDIZAGEM}
            >
              <GraficosAcompanhamentoAprendizagem
                anoLetivo={anoLetivo}
                dreId={dreId}
                ueId={ueId}
                dataUltimaConsolidacao={dataUltimaConsolidacao}
              />
            </TabPane>
          </ContainerTabsCard>
        </ContainerTabsDashboard>
      ) : (
        ''
      )}
    </>
  );
};

TabsDashboardRelAcompanhamentoAprendizagem.propTypes = {
  anoLetivo: PropTypes.oneOfType([PropTypes.any]),
  ueId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  dreId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  dataUltimaConsolidacao: PropTypes.oneOfType([PropTypes.any]),
};

TabsDashboardRelAcompanhamentoAprendizagem.defaultProps = {
  anoLetivo: null,
  dreId: null,
  ueId: null,
  dataUltimaConsolidacao: null,
};

export default TabsDashboardRelAcompanhamentoAprendizagem;
