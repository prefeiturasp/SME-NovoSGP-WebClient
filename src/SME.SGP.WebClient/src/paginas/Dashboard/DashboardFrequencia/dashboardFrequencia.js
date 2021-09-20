import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { Cabecalho } from '~/componentes-sgp';
import { Button, Card, Colors } from '~/componentes';

import { URL_HOME } from '~/constantes';
import { history } from '~/servicos';

import { limparDadosDashboardFrequencia } from '~/redux/modulos/dashboardFrequencia/actions';

import DashboardFrequenciaFiltros from './DashboardFrequenciaFiltros/dashboardFrequenciaFiltros';
import TabsDashboardFrequencia from './TabsDashboardFrequencia/tabsDashboardFrequencia';

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
