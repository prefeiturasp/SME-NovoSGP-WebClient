import React from 'react';
import { useSelector } from 'react-redux';
import { AlertaPermiteSomenteTurmaInfantil } from '~/componentes-sgp';
import { ModalidadeDTO } from '~/dtos';

const DashboardDiarioBordoAlertaInfantil = () => {
  const { modalidade } = useSelector(
    store => store.dashboardDiarioBordo?.dadosDashboardDiarioBordo
  );

  return (
    <AlertaPermiteSomenteTurmaInfantil
      exibir={modalidade && Number(modalidade) !== ModalidadeDTO.INFANTIL}
      validarModalidadeFiltroPrincipal={false}
    />
  );
};

export default DashboardDiarioBordoAlertaInfantil;
