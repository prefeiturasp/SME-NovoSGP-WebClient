import { store } from '@/core/redux';
import { cloneDeep } from 'lodash';
import QuestionarioDinamicoFuncoes from '~/componentes-sgp/QuestionarioDinamico/Funcoes/QuestionarioDinamicoFuncoes';
import {
  limparDadosMapeamentoEstudantes,
  setDadosSecoesMapeamentoEstudantes,
  setEstudantesMapeamentoEstudantes,
  setExibirLoaderMapeamentoEstudantes,
  setMapeamentoEstudanteId,
} from '~/redux/modulos/mapeamentoEstudantes/actions';
import {
  setLimparDadosQuestionarioDinamico,
  setListaSecoesEmEdicao,
} from '~/redux/modulos/questionarioDinamico/actions';
import { confirmar, sucesso } from '~/servicos';
import { URL_API_MAPEAMENTOS_ESTUDANTES } from '../constants/urls-api';
import { AlunoDadosBasicosDto } from '../dto/AlunoDadosBasicosDto';
import { AlunoSinalizadoPrioridadeMapeamentoEstudanteDto } from '../dto/AlunoSinalizadoPrioridadeMapeamentoEstudanteDto';
import { FiltroQuestoesQuestionarioMapeamentoEstudanteDto } from '../dto/FiltroQuestoesQuestionarioMapeamentoEstudanteDto';
import { MapeamentoEstudanteDto } from '../dto/MapeamentoEstudanteDto';
import { MapeamentoEstudanteSecaoDto } from '../dto/MapeamentoEstudanteSecaoDto';
import { MapeamentoEstudanteSecaoQuestaoDto } from '../dto/MapeamentoEstudanteSecaoQuestaoDto';
import { OpcoesRespostaFiltroRelatorioMapeamentoEstudanteDto } from '../dto/OpcoesRespostaFiltroRelatorioMapeamentoEstudanteDto';
import { QuestaoDto } from '../dto/QuestaoDto';
import { ResultadoMapeamentoEstudanteDto } from '../dto/ResultadoMapeamentoEstudanteDto';
import { SecaoQuestionarioDto } from '../dto/SecaoQuestionarioDto';
import { TurmaSelecionadaDTO } from '../dto/TurmaSelecionadaDto';
import { inserirRegistro, obterRegistro } from './api';
import fechamentosTurmasService from './fechamentos-turmas-service';

const obterSecoesMapeamentoEstudante = async (mapeamentoEstudanteId?: number) => {
  const { dispatch } = store;

  dispatch(setExibirLoaderMapeamentoEstudantes(true));
  const resposta = await obterRegistro<SecaoQuestionarioDto[]>(
    `${URL_API_MAPEAMENTOS_ESTUDANTES}/secoes`,
    {
      params: { mapeamentoEstudanteId },
    },
  );

  if (resposta.sucesso) {
    dispatch(setDadosSecoesMapeamentoEstudantes(cloneDeep(resposta.dados)));
  } else {
    dispatch(setDadosSecoesMapeamentoEstudantes([]));
  }

  dispatch(setExibirLoaderMapeamentoEstudantes(false));
};

const obterIdentificador = async (
  codigoAluno: string,
  turmaId: number,
  bimestre: number | string,
) => {
  const { dispatch } = store;

  dispatch(setExibirLoaderMapeamentoEstudantes(true));

  const resposta = await obterRegistro<number>(
    `${URL_API_MAPEAMENTOS_ESTUDANTES}/alunos/${codigoAluno}/turmas/${turmaId}/bimestres/${bimestre}/identificador`,
  );

  if (resposta.sucesso) {
    dispatch(setMapeamentoEstudanteId(resposta.dados));
    obterSecoesMapeamentoEstudante(resposta.dados);
  } else {
    dispatch(setMapeamentoEstudanteId());
    dispatch(setExibirLoaderMapeamentoEstudantes(false));
  }
};

const obterQuestionario = (params: FiltroQuestoesQuestionarioMapeamentoEstudanteDto) =>
  obterRegistro<QuestaoDto[]>(
    `${URL_API_MAPEAMENTOS_ESTUDANTES}/questionarios/${params.questionarioId}/questoes`,
    {
      params,
    },
  );

const obterAlunosPriorizadosMapeamentoEstudante = async (
  turmaId: number,
  bimestre: number | string,
  estudantesComparacao: AlunoDadosBasicosDto[],
) => {
  const resposta = await obterRegistro<AlunoSinalizadoPrioridadeMapeamentoEstudanteDto[]>(
    `${URL_API_MAPEAMENTOS_ESTUDANTES}/alunos/turmas/${turmaId}/bimestres/${bimestre}/prioridade-sinalizada`,
  );
  const { dispatch } = store;

  if (resposta?.sucesso) {
    const estudantesSinalizar = resposta.dados;

    const newMap = estudantesComparacao.map((estudante) => {
      const estudanteComparacao = estudantesSinalizar.find(
        (item) => item?.codigoAluno === estudante?.codigoEOL,
      );

      if (estudanteComparacao) {
        estudante.processoConcluido = !!estudanteComparacao?.possuiMapeamentoEstudante;
        estudante.exibirIconeCustomizado = true;
      } else {
        estudante.exibirIconeCustomizado = false;
        estudante.processoConcluido = false;
      }

      return estudante;
    });
    dispatch(setEstudantesMapeamentoEstudantes(newMap));
  } else {
    dispatch(setEstudantesMapeamentoEstudantes(estudantesComparacao));
  }

  dispatch(setExibirLoaderMapeamentoEstudantes(false));
};

const salvar = async (
  confirmarAntesSalvar = true,
  atualizarDadosAposSalvar = false,
  atualizarSinalizacao = true,
): Promise<boolean> => {
  const { dispatch } = store;

  const state = store.getState();

  const { questionarioDinamico } = state;

  const { questionarioDinamicoEmEdicao } = questionarioDinamico;

  if (!questionarioDinamicoEmEdicao) return true;

  if (questionarioDinamicoEmEdicao && confirmarAntesSalvar) {
    const confirmou = await confirmar(
      'Atenção',
      '',
      'Suas alterações não foram salvas, deseja salvar agora?',
    );

    if (!confirmou) return true;
  }

  const { mapeamentoEstudantes, usuario } = state;

  const {
    dadosSecoesMapeamentoEstudantes,
    dadosAlunoObjectCard,
    bimestreSelecionado,
    mapeamentoEstudanteId,
    estudantesMapeamentoEstudantes,
  } = mapeamentoEstudantes;

  const turmaSelecionada = usuario?.turmaSelecionada as TurmaSelecionadaDTO;
  const turmaId = turmaSelecionada?.id;
  const codigoEOL = dadosAlunoObjectCard?.codigoEOL;

  const secoesMapeamentoEstudantes = cloneDeep(dadosSecoesMapeamentoEstudantes);

  const validarCamposObrigatorios = true;
  const dadosMapeados: any = await QuestionarioDinamicoFuncoes.mapearQuestionarios(
    secoesMapeamentoEstudantes,
    validarCamposObrigatorios,
  );

  const formsValidos = !!dadosMapeados?.formsValidos;

  if (formsValidos || dadosMapeados?.secoes?.length) {
    const secoesMapCloned: any = cloneDeep(dadosMapeados.secoes);

    let secoes: MapeamentoEstudanteSecaoDto[] = [];

    if (secoesMapCloned?.length) {
      secoes = secoesMapCloned.map((secao: any) => {
        let questoes = [];

        if (secao?.questoes?.length) {
          questoes = secao.questoes.map(
            (questao: any): MapeamentoEstudanteSecaoQuestaoDto => ({
              questaoId: questao?.questaoId,
              resposta: questao?.resposta,
              tipoQuestao: questao?.tipoQuestao,
              respostaMapeamentoEstudanteId: questao?.respostaEncaminhamentoId || 0,
            }),
          );
        }

        return { concluido: secao?.concluido, secaoId: secao?.secaoId, questoes };
      });
    }

    const paramsSalvar: MapeamentoEstudanteDto = {
      alunoCodigo: codigoEOL,
      alunoNome: dadosAlunoObjectCard?.nome,
      bimestre: bimestreSelecionado,
      id: mapeamentoEstudanteId,
      secoes,
      turmaId,
    };

    dispatch(setExibirLoaderMapeamentoEstudantes(true));

    const resposta = await inserirRegistro<ResultadoMapeamentoEstudanteDto>(
      URL_API_MAPEAMENTOS_ESTUDANTES,
      paramsSalvar,
    );

    if (atualizarSinalizacao) {
      obterAlunosPriorizadosMapeamentoEstudante(
        turmaId,
        bimestreSelecionado,
        estudantesMapeamentoEstudantes,
      );
    }

    dispatch(setExibirLoaderMapeamentoEstudantes(false));

    if (atualizarDadosAposSalvar && resposta?.sucesso) {
      dispatch(setDadosSecoesMapeamentoEstudantes(undefined));
      dispatch(setMapeamentoEstudanteId(resposta.dados?.id));
      dispatch(setLimparDadosQuestionarioDinamico());
      dispatch(setListaSecoesEmEdicao([]));

      obterSecoesMapeamentoEstudante(resposta.dados?.id);
    }

    if (resposta?.sucesso) {
      sucesso('Suas informações foram salvas com sucesso.');
      return true;
    }
  }

  return false;
};

const obterEstudantes = async () => {
  const { dispatch } = store;

  const state = store.getState();

  const { mapeamentoEstudantes, usuario } = state;

  const turmaSelecionada = usuario.turmaSelecionada as TurmaSelecionadaDTO;

  const turmaId = turmaSelecionada?.id;
  const codigoTurma = turmaSelecionada?.turma;
  const anoLetivo = turmaSelecionada?.anoLetivo;
  const periodo = turmaSelecionada?.periodo;

  const { estudantesMapeamentoEstudantes, bimestreSelecionado } = mapeamentoEstudantes;

  if (estudantesMapeamentoEstudantes?.length) {
    obterAlunosPriorizadosMapeamentoEstudante(
      turmaId,
      bimestreSelecionado,
      estudantesMapeamentoEstudantes,
    );
  } else {
    dispatch(setExibirLoaderMapeamentoEstudantes(true));

    const resposta = await fechamentosTurmasService.obterAlunos(codigoTurma, anoLetivo, periodo);

    if (resposta?.sucesso) {
      obterAlunosPriorizadosMapeamentoEstudante(turmaId, bimestreSelecionado, resposta.dados);
    } else {
      dispatch(limparDadosMapeamentoEstudantes());
      dispatch(setEstudantesMapeamentoEstudantes([]));
      dispatch(setExibirLoaderMapeamentoEstudantes(false));
    }
  }
};

const obterFiltrosOpcoesRespostaMapeamentoEstudante = () =>
  obterRegistro<OpcoesRespostaFiltroRelatorioMapeamentoEstudanteDto>(
    `${URL_API_MAPEAMENTOS_ESTUDANTES}/relatorios/filtros/opcoes-resposta`,
  );

export default {
  salvar,
  obterEstudantes,
  obterQuestionario,
  obterIdentificador,
  obterAlunosPriorizadosMapeamentoEstudante,
  obterFiltrosOpcoesRespostaMapeamentoEstudante,
};
