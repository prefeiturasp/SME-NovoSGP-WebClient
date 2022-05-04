import React from 'react';
import { Card } from '~/componentes';
import { Cabecalho } from '~/componentes-sgp';
import DashboardNAAPAFiltros from './dashboardNAAPAFiltros';
import DashboardNAAPATabs from './dashboardNAAPATabs';
import NAAPAContextProvider from './naapaContextProvider';

const DashboardNAAPA = () => {
  return (
    <NAAPAContextProvider>
      <Cabecalho pagina="Dashboard  NAAPA" />
      <Card>
        <DashboardNAAPAFiltros />
        <DashboardNAAPATabs />
      </Card>
    </NAAPAContextProvider>
  );
};

export default DashboardNAAPA;
