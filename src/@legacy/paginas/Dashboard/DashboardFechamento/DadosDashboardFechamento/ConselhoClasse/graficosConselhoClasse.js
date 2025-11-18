import React from 'react';
import { useSelector } from 'react-redux';

import { BIMESTRE_FINAL, OPCAO_TODOS } from '~/constantes/constantes';

import SituacaoConselhoClasse from './SituacaoConselhoClasse/situacaoConselhoClasse';
import NotasFinais from './NotasFinais/notasFinais';
import ParecerConclusivo from './ParecerConclusivo/parecerConclusivo';

const GraficosConselhoClasse = () => {
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
  const ehBimestreFinal = bimestre === BIMESTRE_FINAL;
  const dreId = ehTodosDre ? OPCAO_TODOS : dre?.id;
  const ueId = ehTodosUe ? OPCAO_TODOS : ue?.id;

  return (
    <>
      <SituacaoConselhoClasse
        anoLetivo={anoLetivo}
        dreId={dreId}
        ueId={ueId}
        modalidade={modalidade}
        semestre={semestre}
        bimestre={bimestre}
      />
      <NotasFinais
        anoLetivo={anoLetivo}
        dreId={dreId}
        ueId={ueId}
        modalidade={modalidade}
        semestre={semestre}
        bimestre={bimestre}
      />
      {ehBimestreFinal && (
        <ParecerConclusivo
          anoLetivo={anoLetivo}
          dreId={dreId}
          ueId={ueId}
          modalidade={modalidade}
          semestre={semestre}
          bimestre={bimestre}
        />
      )}
    </>
  );
};

export default GraficosConselhoClasse;
