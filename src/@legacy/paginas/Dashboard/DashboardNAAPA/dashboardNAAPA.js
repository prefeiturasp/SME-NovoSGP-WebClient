import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '~/componentes';
import { Cabecalho } from '~/componentes-sgp';
import BotaoVoltarPadrao from '~/componentes-sgp/BotoesAcaoPadrao/botaoVoltarPadrao';
import { URL_HOME } from '~/constantes';
import DashboardNAAPAFiltros from './dashboardNAAPAFiltros';
import DashboardNAAPATabs from './dashboardNAAPATabs';
import NAAPAContextProvider from './naapaContextProvider';

const DashboardNAAPA = () => {
  const navigate = useNavigate();

  return (
    <NAAPAContextProvider>
      <Cabecalho pagina="Dashboard NAAPA">
        <BotaoVoltarPadrao onClick={() => navigate(URL_HOME)} />
      </Cabecalho>
      <Card padding="24px 24px">
        <DashboardNAAPAFiltros />
        <DashboardNAAPATabs />
      </Card>
    </NAAPAContextProvider>
  );
};

export default DashboardNAAPA;
