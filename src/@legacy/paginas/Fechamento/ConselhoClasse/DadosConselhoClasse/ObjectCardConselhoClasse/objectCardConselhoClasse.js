import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import DetalhesAluno from '~/componentes/Alunos/Detalhes';
import ServicoConselhoClasse from '~/servicos/Paginas/ConselhoClasse/ServicoConselhoClasse';
import { erro, erros, sucesso } from '~/servicos/alertas';
import { Loader } from '~/componentes';

const ObjectCardConselhoClasse = () => {
  const usuario = useSelector(store => store.usuario);
  const { turmaSelecionada } = usuario;
  const { turma } = turmaSelecionada;

  const [gerandoConselhoClasse, setGerandoConselhoClasse] = useState(false);
  const [carregandoFrequencia, setCarregandoFrequencia] = useState(false);
  const [frequencia, setFrequencia] = useState();

  const dadosAlunoObjectCard = useSelector(
    store => store.conselhoClasse.dadosAlunoObjectCard
  );

  const salvouJustificativa = useSelector(
    store => store.conselhoClasse.salvouJustificativa
  );

  const conselhoClasseAlunoId = useSelector(
    store =>
      store.conselhoClasse.dadosPrincipaisConselhoClasse.conselhoClasseAlunoId
  );

  const conselhoClasseId = useSelector(
    store => store.conselhoClasse.dadosPrincipaisConselhoClasse.conselhoClasseId
  );

  const fechamentoTurmaId = useSelector(
    store =>
      store.conselhoClasse.dadosPrincipaisConselhoClasse.fechamentoTurmaId
  );

  const desabilitarCampos = useSelector(
    store => store.conselhoClasse.desabilitarCampos
  );

  const obterFrequenciaAluno = useCallback(async () => {
    setCarregandoFrequencia(true);

    const retorno = await ServicoConselhoClasse.obterFrequenciaAluno(
      dadosAlunoObjectCard.codigoEOL,
      turma
    )
      .catch(e => erros(e))
      .finally(() => setCarregandoFrequencia(false));

    setFrequencia(retorno?.data);
  }, [turma, dadosAlunoObjectCard.codigoEOL]);

  useEffect(() => {
    if (dadosAlunoObjectCard.codigoEOL && turma) {
      obterFrequenciaAluno();
    }
  }, [dadosAlunoObjectCard.codigoEOL, turma, obterFrequenciaAluno]);

  const gerarConselhoClasseAluno =  (dados) => {
    setGerandoConselhoClasse(true);
    ServicoConselhoClasse.gerarConselhoClasseAluno(
      conselhoClasseId,
      fechamentoTurmaId,
      dadosAlunoObjectCard.codigoEOL,
      dados?.frequencia
    )
      .then(() => {
        sucesso(
          'Solicitação de geração do relatório gerada com sucesso. Em breve você receberá uma notificação com o resultado.'
        );
      })
      .finally(setGerandoConselhoClasse(false))
      .catch(e => erro(e));
  };

  return (
    <Loader loading={gerandoConselhoClasse || carregandoFrequencia}>
      <DetalhesAluno
        dados={{ ...dadosAlunoObjectCard, frequencia }}
        desabilitarImprimir={!salvouJustificativa && !conselhoClasseAlunoId}
        onClickImprimir={gerarConselhoClasseAluno}
        permiteAlterarImagem={!desabilitarCampos}
      />
    </Loader>
  );
};

export default ObjectCardConselhoClasse;
