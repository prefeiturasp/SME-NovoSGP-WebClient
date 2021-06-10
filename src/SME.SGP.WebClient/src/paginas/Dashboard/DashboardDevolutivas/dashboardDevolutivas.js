import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Cabecalho } from '~/componentes-sgp';
import Button from '~/componentes/button';
import Card from '~/componentes/card';
import { Colors } from '~/componentes/colors';
import { URL_HOME } from '~/constantes/url';
import { limparDadosDashboardDevolutivas } from '~/redux/modulos/dashboardDevolutivas/actions';
import history from '~/servicos/history';
import GraficosDevolutivas from './DadosDashboardDevolutivas/graficosDevolutivas';
import DashboardDevolutivasAlertaInfantil from './dashboardDevolutivasAlertaInfantil';
import DashboardDevolutivasFiltros from './dashboardDevolutivasFiltros';

const DashboardDevolutivas = () => {
  const dispatch = useDispatch();

  const onClickVoltar = () => {
    history.push(URL_HOME);
  };

  useEffect(() => {
    return () => {
      dispatch(limparDadosDashboardDevolutivas());
    };
  }, [dispatch]);

  return (
    <>
      <DashboardDevolutivasAlertaInfantil />
      <Cabecalho pagina="Dashboard devolutivas" />
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
          <DashboardDevolutivasFiltros />
          <div className="row">
            <div className="col-md-12 mt-2">
              <GraficosDevolutivas />
            </div>
          </div>
        </div>
      </Card>
    </>
  );
};

export default DashboardDevolutivas;
