import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { Card } from '~/componentes';
import { Cabecalho } from '~/componentes-sgp';

import { URL_HOME } from '~/constantes';
import { history } from '~/servicos';

import { limparDadosDashboardFechamento } from '~/redux/modulos/dashboardFechamento/actions';

import DashboardFechamentoAlertaInfantil from './dashboardDevolutivasAlertaInfantil';
import DashboardFechamentoFiltros from './DashboardFechamentoFiltros/dashboardFechamentoFiltros';
import TabsDashboardFechamento from './TabsDashboardFechamento/tabsDashboardFechamento';
import BotaoVoltarPadrao from '~/componentes-sgp/BotoesAcaoPadrao/botaoVoltarPadrao';

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
      <Cabecalho pagina="Dashboard fechamento">
        <BotaoVoltarPadrao onClick={() => onClickVoltar()} />
      </Cabecalho>
      <Card>
        <div className="col-md-12">
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
