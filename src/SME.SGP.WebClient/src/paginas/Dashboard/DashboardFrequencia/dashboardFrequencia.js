import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { Cabecalho } from '~/componentes-sgp';
import { Button, Card, Colors } from '~/componentes';

import { URL_HOME } from '~/constantes';
import { history } from '~/servicos';

import { limparDadosDashboardFrequencia } from '~/redux/modulos/dashboardFrequencia/actions';

import DashboardFrequenciaFiltros from './DashboardFrequenciaFiltros/dashboardFrequenciaFiltros';
import TabsDashboardFrequencia from './TabsDashboardFrequencia/tabsDashboardFrequencia';
import { SGP_BUTTON_VOLTAR } from '~/componentes-sgp/filtro/idsCampos';

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
