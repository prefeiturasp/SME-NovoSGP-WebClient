import { FiltroSecoesDeRegistroAcao } from '../dto/FiltroSecoesDeRegistroAcao';
import { SecaoQuestionarioDto } from '../dto/SecaoQuestionarioDto';
import { deletarRegistro, obterRegistro } from './api';

export const URL_API_BUSCA_ATIVA = 'v1/busca-ativa';

const obterSecoesDeRegistroAcao = (params?: FiltroSecoesDeRegistroAcao) =>
  obterRegistro<SecaoQuestionarioDto>(`${URL_API_BUSCA_ATIVA}/registros-acao/secoes`, { params });

const obterQuestionario = (questionarioId: number, registroAcaoId?: number) =>
  obterRegistro<SecaoQuestionarioDto>(
    `${URL_API_BUSCA_ATIVA}/registros-acao/questionario/${questionarioId}`,
    { params: { registroAcaoId } },
  );

const obterRegistroAcao = (registroAcaoId: number) =>
  obterRegistro<SecaoQuestionarioDto>(`${URL_API_BUSCA_ATIVA}/registros-acao/${registroAcaoId}`);

const excluirRegistroAcao = (registroAcaoId: number) =>
  deletarRegistro<SecaoQuestionarioDto>(`${URL_API_BUSCA_ATIVA}/registros-acao/${registroAcaoId}`);

export default {
  obterSecoesDeRegistroAcao,
  obterQuestionario,
  obterRegistroAcao,
  excluirRegistroAcao,
};
