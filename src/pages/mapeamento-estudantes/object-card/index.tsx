import { AlunoDadosBasicosDto } from '@/core/dto/AlunoDadosBasicosDto';
import { TurmaSelecionadaDTO } from '@/core/dto/TurmaSelecionadaDto';
import { useAppSelector } from '@/core/hooks/use-redux';
import frequenciaService from '@/core/services/frequencia-service';
import { useCallback, useEffect, useState } from 'react';
import { Loader } from '~/componentes';
import DetalhesAluno from '~/componentes/Alunos/Detalhes';

export const ObjectCardMapeamentoEstudantes = () => {
  const usuario = useAppSelector((store) => store.usuario);

  const turmaSelecionada = usuario?.turmaSelecionada as TurmaSelecionadaDTO;

  const turma = turmaSelecionada?.turma;

  const dadosAlunoObjectCard = useAppSelector(
    (store) => store.mapeamentoEstudantes?.dadosAlunoObjectCard,
  ) as AlunoDadosBasicosDto;

  const desabilitarCamposMapeamentoEstudantes = useAppSelector(
    (store) => store.mapeamentoEstudantes?.desabilitarCamposMapeamentoEstudantes,
  );

  const [carregandoFrequencia, setCarregandoFrequencia] = useState(false);
  const [frequencia, setFrequencia] = useState<number>();

  const dados = dadosAlunoObjectCard ? { ...dadosAlunoObjectCard, frequencia } : {};
  const permiteAlterarImagem = !desabilitarCamposMapeamentoEstudantes;

  const obterFrequenciaAluno = useCallback(async () => {
    setCarregandoFrequencia(true);
    const resposta = await frequenciaService.obterFrequenciaGeralAluno(
      dadosAlunoObjectCard?.codigoEOL,
      turma,
    );

    setFrequencia(resposta?.dados);
    setCarregandoFrequencia(false);
  }, [turma, dadosAlunoObjectCard?.codigoEOL]);

  useEffect(() => {
    if (dadosAlunoObjectCard?.codigoEOL && turma) {
      obterFrequenciaAluno();
    }
  }, [dadosAlunoObjectCard?.codigoEOL, turma, obterFrequenciaAluno]);

  return (
    <Loader loading={carregandoFrequencia}>
      <DetalhesAluno dados={dados} permiteAlterarImagem={permiteAlterarImagem} />
    </Loader>
  );
};
