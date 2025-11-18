import React from 'react';
import { useSelector } from 'react-redux';
import Alert from '~/componentes/alert';
import { ehTurmaInfantil } from '~/servicos/Validacoes/validacoesInfatil';

const AlertaDentroPeriodoPAP = () => {
  const periodoSelecionadoPAP = useSelector(
    store => store.relatorioPAP.periodoSelecionadoPAP
  );

  const { turmaSelecionada } = useSelector(store => store.usuario);

  const modalidadesFiltroPrincipal = useSelector(
    store => store.filtro.modalidades
  );

  const periodoFechado = !!(
    periodoSelecionadoPAP && !periodoSelecionadoPAP?.periodoAberto
  );

  const turmaSelecionadaEhInfantil = ehTurmaInfantil(
    modalidadesFiltroPrincipal,
    turmaSelecionada
  );

  return (
    <>
      {periodoFechado &&
        turmaSelecionada?.turma &&
        !turmaSelecionadaEhInfantil && (
          <Alert
            alerta={{
              tipo: 'warning',
              mensagem:
                'Não é possível preencher o relatório fora do período estipulado pela SME',
            }}
          />
        )}
    </>
  );
};

export default AlertaDentroPeriodoPAP;
