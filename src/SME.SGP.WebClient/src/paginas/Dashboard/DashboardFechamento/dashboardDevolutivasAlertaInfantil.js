import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { AlertaPermiteSomenteTurmaInfantil } from '~/componentes-sgp';
import AlertaNaoPermiteTurmaInfantil from '~/componentes-sgp/AlertaNaoPermiteTurmaInfantil/alertaNaoPermiteTurmaInfantil';
import { OPCAO_TODOS } from '~/constantes/constantes';
import { ModalidadeDTO } from '~/dtos';

const DashboardFechamentoAlertaInfantil = () => {
  const { ue } = useSelector(
    store => store.dashboardFechamento?.dadosDashboardFechamento
  );

  const { modalidade } = useSelector(
    store => store.dashboardFechamento?.dadosDashboardFechamento
  );

  const [exibir, setExibir] = useState(false);

  useEffect(() => {
    let exibirAlerta = false;

    if (ue && ue?.codigo === OPCAO_TODOS) {
      exibirAlerta =
        modalidade && Number(modalidade) === ModalidadeDTO.INFANTIL;
    } else {
      exibirAlerta = ue && ue?.ehInfantil;
    }

    setExibir(exibirAlerta);
  }, [ue, modalidade]);

  return <AlertaNaoPermiteTurmaInfantil exibir={exibir} />;
};

export default DashboardFechamentoAlertaInfantil;
