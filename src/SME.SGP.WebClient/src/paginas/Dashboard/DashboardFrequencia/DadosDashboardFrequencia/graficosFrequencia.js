import React from 'react';
import { useSelector } from 'react-redux';

import { OPCAO_TODOS } from '~/constantes/constantes';

import FrequenciaGlobalPorAno from './FrequenciaGlobalPorAno/frequenciaGlobalPorAno';
import FrequenciaGlobalPorDRE from './FrequenciaGlobalPorDRE/frequenciaGlobalPorDRE';
import QuantidadeAusenciasPossuemJustificativa from './QuantidadeAusenciasPossuemJustificativa/quantidadeAusenciasPossuemJustificativa';
import QuantidadeJustificativasPorMotivo from './QuantidadeJustificativasPorMotivo/quantidadeJustificativasPorMotivo';

const GraficosFrequencia = () => {
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

  const exibirFrequenciaGlobalPorDRE = ehTodosDre && ue?.codigo === OPCAO_TODOS;

  return (
    <>
      <FrequenciaGlobalPorAno
        anoLetivo={anoLetivo}
        dreId={dreId}
        ueId={ueId}
        modalidade={modalidade}
        semestre={semestre}
      />
      {exibirFrequenciaGlobalPorDRE && (
        <FrequenciaGlobalPorDRE
          anoLetivo={anoLetivo}
          modalidade={modalidade}
          semestre={semestre}
        />
      )}
      <QuantidadeAusenciasPossuemJustificativa
        anoLetivo={anoLetivo}
        dreId={dreId}
        ueId={ueId}
        modalidade={modalidade}
        semestre={semestre}
      />
      <QuantidadeJustificativasPorMotivo
        anoLetivo={anoLetivo}
        dreId={dreId}
        ueId={ueId}
        modalidade={modalidade}
        semestre={semestre}
        codigoUe={ue?.codigo}
      />
    </>
  );
};

export default GraficosFrequencia;
