import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Cabecalho } from '~/componentes-sgp';
import Button from '~/componentes/button';
import Card from '~/componentes/card';
import { Colors } from '~/componentes/colors';
import { URL_HOME } from '~/constantes/url';
import { limparDadosDashboardRegistroIndividual } from '~/redux/modulos/dashboardRegistroIndividual/actions';
import history from '~/servicos/history';
import GraficosRegistroIndividual from './DadosDashboardRegistroIndividual/graficosRegistroIndividual';
import DashboardRegistroIndividualAlertaInfantil from './dashboardRegistroIndividualAlertaInfantil';
import DashboardRegistroIndividualFiltros from './dashboardRegistroIndividualFiltros';

const DashboardRegistroIndividual = () => {
  const dispatch = useDispatch();

  const onClickVoltar = () => history.push(URL_HOME);

  useEffect(() => {
    return () => {
      dispatch(limparDadosDashboardRegistroIndividual());
    };
  }, [dispatch]);

  return (
    <>
      <DashboardRegistroIndividualAlertaInfantil />
      <Cabecalho pagina="Dashboard registro individual" />
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
          <DashboardRegistroIndividualFiltros />
          <div className="row">
            <div className="col-md-12 mt-2">
              <GraficosRegistroIndividual />
            </div>
          </div>
        </div>
      </Card>
    </>
  );
};

export default DashboardRegistroIndividual;
