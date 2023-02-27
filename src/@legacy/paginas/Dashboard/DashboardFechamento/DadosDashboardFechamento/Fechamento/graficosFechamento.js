import React from 'react';
import { useSelector } from 'react-redux';

import { OPCAO_TODOS } from '~/constantes/constantes';
import FechamentoPorEstudantes from './FechamentoPorEstudantes/fechamentoPorEstudantes';
import PendenciasFechamento from './PendenciasFechamento/pedenciasFechamento';
import SituacaoProcessoFechamento from './SituacaoProcessoFechamento/situacaoProcessoFechamento';

const GraficosFechamento = () => {
  const anoLetivo = useSelector(
    store => store.dashboardFechamento?.dadosDashboardFechamento?.anoLetivo
  );
  const dre = useSelector(
    store => store.dashboardFechamento?.dadosDashboardFechamento?.dre
  );
  const ue = useSelector(
    store => store.dashboardFechamento?.dadosDashboardFechamento?.ue
  );
  const modalidade = useSelector(
    store => store.dashboardFechamento?.dadosDashboardFechamento?.modalidade
  );
  const semestre = useSelector(
    store => store.dashboardFechamento?.dadosDashboardFechamento?.semestre
  );
  const bimestre = useSelector(
    store => store.dashboardFechamento?.dadosDashboardFechamento?.bimestre
  );

  const ehTodosDre = OPCAO_TODOS === dre?.codigo;
  const ehTodosUe = OPCAO_TODOS === ue?.codigo;
  const dreId = ehTodosDre ? OPCAO_TODOS : dre?.id;
  const ueId = ehTodosUe ? OPCAO_TODOS : ue?.id;

  return (
    <>
      <SituacaoProcessoFechamento
        anoLetivo={anoLetivo}
        dreId={dreId}
        ueId={ueId}
        modalidade={modalidade}
        semestre={semestre}
        bimestre={bimestre}
      />
      <FechamentoPorEstudantes
        anoLetivo={anoLetivo}
        dreId={dreId}
        ueId={ueId}
        modalidade={modalidade}
        semestre={semestre}
        bimestre={bimestre}
      />
      <PendenciasFechamento
        anoLetivo={anoLetivo}
        dreId={dreId}
        ueId={ueId}
        modalidade={modalidade}
        semestre={semestre}
        bimestre={bimestre}
      />
    </>
  );
};

export default GraficosFechamento;
