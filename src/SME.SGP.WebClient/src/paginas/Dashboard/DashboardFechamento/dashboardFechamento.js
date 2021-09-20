import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { Card, Button, Colors } from '~/componentes';
import { Cabecalho } from '~/componentes-sgp';

import { URL_HOME } from '~/constantes';
import { history } from '~/servicos';

import { limparDadosDashboardFechamento } from '~/redux/modulos/dashboardFechamento/actions';

import DashboardFechamentoAlertaInfantil from './dashboardDevolutivasAlertaInfantil';
import DashboardFechamentoFiltros from './DashboardFechamentoFiltros/dashboardFechamentoFiltros';
import TabsDashboardFechamento from './TabsDashboardFechamento/tabsDashboardFechamento';

const DashboardFechamento = () => {
  const dispatch = useDispatch();

  const onClickVoltar = () => {
    history.push(URL_HOME);
  };

  useEffect(() => {
    return () => {
      dispatch(limparDadosDashboardFechamento());
    };
  }, [dispatch]);

  return (
    <>
      <DashboardFechamentoAlertaInfantil />
      <Cabecalho pagina="Dashboard fechamento" classes="mb-2" />
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
