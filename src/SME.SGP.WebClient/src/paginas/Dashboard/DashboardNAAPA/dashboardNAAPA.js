import React from 'react';
import { Button, Card, Colors } from '~/componentes';
import { Cabecalho } from '~/componentes-sgp';
import { SGP_BUTTON_VOLTAR } from '~/componentes-sgp/filtro/idsCampos';
import { URL_HOME } from '~/constantes';
import { history } from '~/servicos';
import DashboardNAAPAFiltros from './dashboardNAAPAFiltros';
import DashboardNAAPATabs from './dashboardNAAPATabs';
import NAAPAContextProvider from './naapaContextProvider';

const DashboardNAAPA = () => {
  return (
    <NAAPAContextProvider>
      <Cabecalho pagina="Dashboard NAAPA">
        <Button
          id={SGP_BUTTON_VOLTAR}
          label="Voltar"
          icon="arrow-left"
          color={Colors.Azul}
          border
          onClick={() => {
            history.push(URL_HOME);
          }}
        />
      </Cabecalho>
      <Card>
        <DashboardNAAPAFiltros />
        <DashboardNAAPATabs />
      </Card>
    </NAAPAContextProvider>
  );
};

export default DashboardNAAPA;
