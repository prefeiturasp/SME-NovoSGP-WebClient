import React from 'react';
import { Card } from '~/componentes';
import { Cabecalho } from '~/componentes-sgp';
import BotaoVoltarPadrao from '~/componentes-sgp/BotoesAcaoPadrao/botaoVoltarPadrao';
import { URL_HOME } from '~/constantes';
import { history } from '~/servicos';
import DashboardNAAPAFiltros from './dashboardNAAPAFiltros';
import DashboardNAAPATabs from './dashboardNAAPATabs';
import NAAPAContextProvider from './naapaContextProvider';

const DashboardNAAPA = () => {
  return (
    <NAAPAContextProvider>
      <Cabecalho pagina="Dashboard NAAPA">
        <BotaoVoltarPadrao onClick={() => history.push(URL_HOME)} />
      </Cabecalho>
      <Card padding="24px 24px">
        <DashboardNAAPAFiltros />
        <DashboardNAAPATabs />
      </Card>
    </NAAPAContextProvider>
  );
};

export default DashboardNAAPA;
