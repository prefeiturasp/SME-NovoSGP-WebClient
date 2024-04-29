import {
  setLimparDadosQuestionarioDinamico,
  setListaSecoesEmEdicao,
  setQuestionarioDinamicoEmEdicao,
} from '@/@legacy/redux/modulos/questionarioDinamico/actions';
import { TurmaSelecionadaDTO } from '@/core/dto/TurmaSelecionadaDto';
import { useAppDispatch, useAppSelector } from '@/core/hooks/use-redux';
import fechamentosTurmasService from '@/core/services/fechamentos-turmas-service';

import { useCallback, useEffect } from 'react';
import {
  limparDadosMapeamentoEstudantes,
  setDadosAlunoObjectCard,
  setEstudantesMapeamentoEstudantes,
  setExibirLoaderMapeamentoEstudantes,
} from '~/redux/modulos/mapeamentoEstudantes/actions';

import { AlunoDadosBasicosDto } from '@/core/dto/AlunoDadosBasicosDto';
import mapeamentoEstudantesService from '@/core/services/mapeamento-estudantes-service';
import { BimestresMapeamentoEstudantes } from '../bimestres';
import { ObjectCardMapeamentoEstudantes } from '../object-card';
import { TabelaRetratilMapeamentoEstudantes } from '../tabela-retratil';

export const DadosMapeamentoEstudantes = () => {
  const dispatch = useAppDispatch();
  const usuario = useAppSelector((store) => store.usuario);

  const turmaSelecionada = usuario?.turmaSelecionada as TurmaSelecionadaDTO;

  const turma = turmaSelecionada?.turma;
  const anoLetivo = turmaSelecionada?.anoLetivo;
  const periodo = turmaSelecionada?.periodo;

  const dadosAlunoObjectCard = useAppSelector(
    (store) => store.mapeamentoEstudantes?.dadosAlunoObjectCard as AlunoDadosBasicosDto,
  );

  const obterListaAlunos = useCallback(async () => {
    dispatch(setExibirLoaderMapeamentoEstudantes(true));

    const resposta = await fechamentosTurmasService.obterAlunos(turma, anoLetivo, periodo);

    if (resposta?.sucesso) {
      dispatch(setEstudantesMapeamentoEstudantes(resposta.dados));
    } else {
      dispatch(limparDadosMapeamentoEstudantes());
      dispatch(setEstudantesMapeamentoEstudantes([]));
    }

    dispatch(setExibirLoaderMapeamentoEstudantes(false));
  }, [dispatch, turma, anoLetivo, periodo]);

  useEffect(() => {
    if (turma && anoLetivo) {
      obterListaAlunos();
    } else {
      dispatch(setEstudantesMapeamentoEstudantes([]));
    }
  }, [dispatch, turma, anoLetivo, periodo, obterListaAlunos]);

  const limparDados = () => {
    dispatch(limparDadosMapeamentoEstudantes([]));
    dispatch(setLimparDadosQuestionarioDinamico());
    dispatch(setListaSecoesEmEdicao([]));
    dispatch(setQuestionarioDinamicoEmEdicao(false));
  };

  const onChangeAlunoSelecionado = async (aluno: AlunoDadosBasicosDto) => {
    if (aluno?.codigoEOL === dadosAlunoObjectCard?.codigoEOL) return;

    limparDados();

    dispatch(setDadosAlunoObjectCard({ ...aluno }));
  };

  const permiteOnChangeAluno = async () => {
    const continuar = await mapeamentoEstudantesService.salvar();

    if (continuar) {
      dispatch(limparDadosMapeamentoEstudantes([]));
      dispatch(setLimparDadosQuestionarioDinamico());
      dispatch(setListaSecoesEmEdicao([]));

      return true;
    }

    return false;
  };

  return (
    <TabelaRetratilMapeamentoEstudantes
      onChangeAlunoSelecionado={onChangeAlunoSelecionado}
      permiteOnChangeAluno={permiteOnChangeAluno}
    >
      <ObjectCardMapeamentoEstudantes />
      {dadosAlunoObjectCard?.codigoEOL ? <BimestresMapeamentoEstudantes /> : <></>}
    </TabelaRetratilMapeamentoEstudantes>
  );
};
