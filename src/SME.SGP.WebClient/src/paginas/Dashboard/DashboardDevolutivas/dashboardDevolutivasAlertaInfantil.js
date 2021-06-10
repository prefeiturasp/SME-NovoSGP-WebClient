import React from 'react';
import { useSelector } from 'react-redux';
import { AlertaPermiteSomenteTurmaInfantil } from '~/componentes-sgp';
import { ModalidadeDTO } from '~/dtos';

const DashboardDevolutivasAlertaInfantil = () => {
  const { modalidade } = useSelector(
    store => store.dashboardDevolutivas?.dadosDashboardDevolutivas
  );

  return (
    <AlertaPermiteSomenteTurmaInfantil
      exibir={modalidade && Number(modalidade) !== ModalidadeDTO.INFANTIL}
      validarModalidadeFiltroPrincipal={false}
    />
  );
};

export default DashboardDevolutivasAlertaInfantil;
