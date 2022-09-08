import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Cabecalho } from '~/componentes-sgp';
import { SGP_BUTTON_VOLTAR } from '~/componentes-sgp/filtro/idsCampos';
import Button from '~/componentes/button';
import Card from '~/componentes/card';
import { Colors } from '~/componentes/colors';
import { URL_HOME } from '~/constantes/url';
import { limparDadosDashboardDiarioBordo } from '~/redux/modulos/dashboardDiarioBordo/actions';
import history from '~/servicos/history';
import GraficosDiarioBordo from './DadosDashboardDiarioBordo/graficosDiarioBordo';
import DashboardDiarioBordoAlertaInfantil from './dashboardDiarioBordoAlertaInfantil';
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
      <DashboardDiarioBordoAlertaInfantil />
      <Cabecalho pagina="Dashboard diário de bordo">
        <Button
          id={SGP_BUTTON_VOLTAR}
          label="Voltar"
          icon="arrow-left"
          color={Colors.Azul}
          border
          onClick={() => onClickVoltar()}
        />
      </Cabecalho>
      <Card>
        <div className="col-md-12">
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
