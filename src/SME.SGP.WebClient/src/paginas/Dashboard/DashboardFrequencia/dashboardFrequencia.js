import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { Cabecalho } from '~/componentes-sgp';
import { Card } from '~/componentes';

import { URL_HOME } from '~/constantes';
import { history } from '~/servicos';

import { limparDadosDashboardFrequencia } from '~/redux/modulos/dashboardFrequencia/actions';

import DashboardFrequenciaFiltros from './DashboardFrequenciaFiltros/dashboardFrequenciaFiltros';
import TabsDashboardFrequencia from './TabsDashboardFrequencia/tabsDashboardFrequencia';
import BotaoVoltarPadrao from '~/componentes-sgp/BotoesAcaoPadrao/botaoVoltarPadrao';

const DashboardFrequencia = () => {
  const dispatch = useDispatch();

  const onClickVoltar = () => {
    history.push(URL_HOME);
  };

  useEffect(() => {
    return () => {
      dispatch(limparDadosDashboardFrequencia());
    };
  }, [dispatch]);

  return (
    <>
      <Cabecalho pagina="Dashboard frequência">
        <BotaoVoltarPadrao onClick={() => onClickVoltar()} />
      </Cabecalho>
      <Card>
        <div className="col-md-12">
          <DashboardFrequenciaFiltros />
          <div className="row">
            <div className="col-md-12 mt-3">
              <TabsDashboardFrequencia />
            </div>
          </div>
        </div>
      </Card>
    </>
  );
};

export default DashboardFrequencia;
