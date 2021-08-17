import React from 'react';
import { Card, Button, Colors } from '~/componentes';
import { Cabecalho } from '~/componentes-sgp';

import { URL_HOME } from '~/constantes';
import { history } from '~/servicos';

import DashboardFechamentoFiltros from './DashboardFechamentoFiltros/dashboardFechamentoFiltros';
import TabsDashboardFechamento from './TabsDashboardFechamento/tabsDashboardFechamento';

const DashboardFechamento = () => {
  const onClickVoltar = () => {
    history.push(URL_HOME);
  };

  return (
    <>
      <Cabecalho pagina="Dashboard frequência" classes="mb-2" />
      <Card>
        <div className="col-md-12 p-0">
          <div className="row">
            <div className="col-md-12 d-flex justify-content-end pb-2">
              <Button
                id="btn-voltar"
                label="Voltar"
                icon="arrow-left"
                color={Colors.Azul}
                border
                onClick={onClickVoltar}
              />
            </div>
          </div>

          <DashboardFechamentoFiltros />
          <div className="row">
            <div className="col-md-12 mt-3">
              <TabsDashboardFechamento />
            </div>
          </div>
        </div>
      </Card>
    </>
  );
};

export default DashboardFechamento;
