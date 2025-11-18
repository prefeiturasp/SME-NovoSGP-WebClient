import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { DetalhesAluno, Loader } from '~/componentes';
import { setMostrarMensagemSemHistorico } from '~/redux/modulos/registroIndividual/actions';

import {
  erros,
  ServicoCalendarios,
  ServicoRegistroIndividual,
  sucesso,
} from '~/servicos';

const ObjectCardRegistroIndividual = () => {
  const [desabilitarBotaoImprimir, setDesabilitarBotaoImprimir] = useState();
  const dadosAlunoObjectCard = useSelector(
    store => store.registroIndividual.dadosAlunoObjectCard
  );

  const desabilitarCampos = useSelector(
    state => state.registroIndividual.desabilitarCampos
  );

  const dataInicioImpressaoRegistrosAnteriores = useSelector(
    state => state.registroIndividual.dataInicioImpressaoRegistrosAnteriores
  );

  const dataFimImpressaoRegistrosAnteriores = useSelector(
    state => state.registroIndividual.dataFimImpressaoRegistrosAnteriores
  );

  const dadosRegistroAtual = useSelector(
    store => store.registroIndividual.dadosRegistroAtual
  );

  const dadosPrincipaisRegistroIndividual = useSelector(
    store => store.registroIndividual.dadosPrincipaisRegistroIndividual
  );

  const turmaSelecionada = useSelector(state => state.usuario.turmaSelecionada);

  const codigoTurma = turmaSelecionada?.turma;

  const { codigoEOL } = dadosAlunoObjectCard;
  const dispatch = useDispatch();

  const [frequencia, setFrequencia] = useState();
  const [exibirLoaderFrequencia, setExibirLoaderFrequencia] = useState(false);

  const gerar = async () => {
    await ServicoRegistroIndividual.gerar({
      alunoCodigo: codigoEOL,
      dataInicio: dataInicioImpressaoRegistrosAnteriores,
      dataFim: dataFimImpressaoRegistrosAnteriores,
      turmaId: turmaSelecionada.id,
    })
      .then(() => {
        sucesso(
          'Solicitação de geração do relatório gerada com sucesso. Em breve você receberá uma notificação com o resultado.'
        );
      })
      .catch(e => erros(e));
  };

  useEffect(() => {
    const desabilitar =
      Object.keys(dadosRegistroAtual).length ||
      dadosPrincipaisRegistroIndividual?.registrosIndividuais?.items.length;

    dispatch(setMostrarMensagemSemHistorico(!desabilitar));
    setDesabilitarBotaoImprimir(!desabilitar);
  }, [
    dispatch,
    dadosPrincipaisRegistroIndividual,
    dadosRegistroAtual,
    desabilitarBotaoImprimir,
  ]);

  const obterFrequenciaGlobalAluno = useCallback(async () => {
    if (codigoEOL && codigoTurma) {
      setExibirLoaderFrequencia(true);
      const retorno = await ServicoCalendarios.obterFrequenciaAluno(
        codigoEOL,
        codigoTurma
      )
        .finally(() => setExibirLoaderFrequencia(false))
        .catch(e => erros(e));

      setFrequencia(retorno?.data || '');
    }
  }, [codigoTurma, codigoEOL]);

  useEffect(() => {
    obterFrequenciaGlobalAluno();
  }, [obterFrequenciaGlobalAluno]);

  return (
    <Loader loading={exibirLoaderFrequencia}>
      <DetalhesAluno
        dados={{ ...dadosAlunoObjectCard, frequencia }}
        permiteAlterarImagem={!desabilitarCampos}
        onClickImprimir={gerar}
        desabilitarImprimir={
          !codigoEOL ||
          !dataInicioImpressaoRegistrosAnteriores ||
          !dataFimImpressaoRegistrosAnteriores ||
          desabilitarBotaoImprimir
        }
      />
    </Loader>
  );
};

export default ObjectCardRegistroIndividual;
