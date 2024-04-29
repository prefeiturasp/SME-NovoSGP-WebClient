import { store } from '@/core/redux';
import { cloneDeep } from 'lodash';
import QuestionarioDinamicoFuncoes from '~/componentes-sgp/QuestionarioDinamico/Funcoes/QuestionarioDinamicoFuncoes';
import {
  setDadosSecoesMapeamentoEstudantes,
  setExibirLoaderMapeamentoEstudantes,
  setMapeamentoEstudanteId,
} from '~/redux/modulos/mapeamentoEstudantes/actions';
import {
  setLimparDadosQuestionarioDinamico,
  setListaSecoesEmEdicao,
} from '~/redux/modulos/questionarioDinamico/actions';
import { confirmar, sucesso } from '~/servicos';
import { URL_API_MAPEAMENTOS_ESTUDANTES } from '../constants/urls-api';
import { FiltroQuestoesQuestionarioMapeamentoEstudanteDto } from '../dto/FiltroQuestoesQuestionarioMapeamentoEstudanteDto';
import { MapeamentoEstudanteDto } from '../dto/MapeamentoEstudanteDto';
import { MapeamentoEstudanteSecaoDto } from '../dto/MapeamentoEstudanteSecaoDto';
import { MapeamentoEstudanteSecaoQuestaoDto } from '../dto/MapeamentoEstudanteSecaoQuestaoDto';
import { QuestaoDto } from '../dto/QuestaoDto';
import { ResultadoMapeamentoEstudanteDto } from '../dto/ResultadoMapeamentoEstudanteDto';
import { SecaoQuestionarioDto } from '../dto/SecaoQuestionarioDto';
import { TurmaSelecionadaDTO } from '../dto/TurmaSelecionadaDto';
import { inserirRegistro, obterRegistro } from './api';

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
  }

  dispatch(setExibirLoaderMapeamentoEstudantes(false));
};

const obterQuestionario = (params: FiltroQuestoesQuestionarioMapeamentoEstudanteDto) =>
  obterRegistro<QuestaoDto[]>(
    `${URL_API_MAPEAMENTOS_ESTUDANTES}/questionarios/${params.questionarioId}/questoes`,
    {
      params,
    },
  );

const salvar = async (
  confirmarAntesSalvar = true,
  atualizarDadosAposSalvar = false,
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

export default { salvar, obterIdentificador, obterQuestionario };
