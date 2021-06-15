import React from 'react';
import { useSelector } from 'react-redux';
import { AlertaPermiteSomenteTurmaInfantil } from '~/componentes-sgp';

const DashboardDevolutivasAlertaInfantil = () => {
  const { ue } = useSelector(
    store => store.dashboardDevolutivas?.dadosDashboardDevolutivas
  );

  return (
    <AlertaPermiteSomenteTurmaInfantil
      exibir={ue && !ue?.ehInfantil}
      validarModalidadeFiltroPrincipal={false}
    />
  );
};

export default DashboardDevolutivasAlertaInfantil;
