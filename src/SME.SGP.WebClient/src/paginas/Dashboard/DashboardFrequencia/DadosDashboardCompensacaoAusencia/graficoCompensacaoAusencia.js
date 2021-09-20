import React from 'react';
import { useSelector } from 'react-redux';

import { OPCAO_TODOS } from '~/constantes/constantes';

import TotalAtividadeCompensacao from './TotalAtividadeCompensacao/totalAtividadeCompensacao';
import TotalAusenciaCompensada from './TotalAusenciaCompensada/totalAusenciaCompensada';

const GraficoCompensacaoAusencia = () => {
  const anoLetivo = useSelector(
    store => store.dashboardFrequencia?.dadosDashboardFrequencia?.anoLetivo
  );
  const dre = useSelector(
    store => store.dashboardFrequencia?.dadosDashboardFrequencia?.dre
  );
  const ue = useSelector(
    store => store.dashboardFrequencia?.dadosDashboardFrequencia?.ue
  );
  const modalidade = useSelector(
    store => store.dashboardFrequencia?.dadosDashboardFrequencia?.modalidade
  );
  const semestre = useSelector(
    store => store.dashboardFrequencia?.dadosDashboardFrequencia?.semestre
  );

  const ehTodosDre = OPCAO_TODOS === dre?.codigo;
  const ehTodosUe = OPCAO_TODOS === ue?.codigo;
  const dreId = ehTodosDre ? OPCAO_TODOS : dre?.id;
  const ueId = ehTodosUe ? OPCAO_TODOS : ue?.id;

  return (
    <>
      <TotalAusenciaCompensada
        anoLetivo={anoLetivo}
        dreId={dreId}
        ueId={ueId}
        modalidade={modalidade}
        semestre={semestre}
      />
      <TotalAtividadeCompensacao
        anoLetivo={anoLetivo}
        dreId={dreId}
        ueId={ueId}
        modalidade={modalidade}
        semestre={semestre}
      />
    </>
  );
};

export default GraficoCompensacaoAusencia;
