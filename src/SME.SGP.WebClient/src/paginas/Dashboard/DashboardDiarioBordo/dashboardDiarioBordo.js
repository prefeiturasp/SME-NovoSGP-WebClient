import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Cabecalho } from '~/componentes-sgp';
import Button from '~/componentes/button';
import Card from '~/componentes/card';
import { Colors } from '~/componentes/colors';
import { URL_HOME } from '~/constantes/url';
import { limparDadosDashboardDiarioBordo } from '~/redux/modulos/dashboardDiarioBordo/actions';
import history from '~/servicos/history';
import GraficosDiarioBordo from './DadosDashboardDiarioBordo/graficosDiarioBordo';
import DashboardDiarioBordoFiltros from './dashboardDiarioBordoFiltros';

const DashboardDiarioBordo = () => {
  const dispatch = useDispatch();

  const onClickVoltar = () => history.push(URL_HOME);

  useEffect(() => {
    return () => {
      dispatch(limparDadosDashboardDiarioBordo());
    };
  }, [dispatch]);

  return (
    <>
      <Cabecalho pagina="Dashboard diário de bordo" />
      <Card>
        <div className="col-md-12">
          <div className="row">
            <div className="col-md-12 d-flex justify-content-end pb-4">
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
          <DashboardDiarioBordoFiltros />
          <div className="row">
            <div className="col-md-12 mt-2">
              <GraficosDiarioBordo />
            </div>
          </div>
        </div>
      </Card>
    </>
  );
};

export default DashboardDiarioBordo;
