import React from 'react';
import { useSelector } from 'react-redux';
import { AlertaPermiteSomenteTurmaInfantil } from '~/componentes-sgp';

const DashboardDiarioBordoAlertaInfantil = () => {
  const { ue } = useSelector(
    store => store.dashboardDiarioBordo?.dadosDashboardDiarioBordo
  );

  return (
    <AlertaPermiteSomenteTurmaInfantil
      exibir={ue && !ue?.ehInfantil}
      validarModalidadeFiltroPrincipal={false}
    />
  );
};

export default DashboardDiarioBordoAlertaInfantil;
