import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Cabecalho } from '~/componentes-sgp';
import BotaoVoltarPadrao from '~/componentes-sgp/BotoesAcaoPadrao/botaoVoltarPadrao';
import Card from '~/componentes/card';
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
      <Cabecalho pagina="Dashboard registro individual">
        <BotaoVoltarPadrao onClick={() => onClickVoltar()} />
      </Cabecalho>
      <Card>
        <div className="col-md-12">
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
