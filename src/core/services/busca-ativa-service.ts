import { DadosResponsavelAtualizarDto } from '../dto/DadosResponsavelAtualizarDto';
import { FiltroSecoesDeRegistroAcao } from '../dto/FiltroSecoesDeRegistroAcao';
import { RegistroAcaoBuscaAtivaDto } from '../dto/RegistroAcaoBuscaAtivaDto';
import { RegistroAcaoBuscaAtivaRespostaDto } from '../dto/RegistroAcaoBuscaAtivaRespostaDto';
import { ResultadoRegistroAcaoBuscaAtivaDto } from '../dto/ResultadoRegistroAcaoBuscaAtivaDto';
import { SecaoQuestionarioDto } from '../dto/SecaoQuestionarioDto';
import { alterarRegistro, deletarRegistro, inserirRegistro, obterRegistro } from './api';

export const URL_API_BUSCA_ATIVA = 'v1/busca-ativa';

const salvarAtualizarRegistroAcao = (params: RegistroAcaoBuscaAtivaDto) =>
  inserirRegistro<ResultadoRegistroAcaoBuscaAtivaDto>(
    `${URL_API_BUSCA_ATIVA}/registros-acao`,
    params,
  );

const obterSecoesDeRegistroAcao = (params: FiltroSecoesDeRegistroAcao) =>
  obterRegistro<SecaoQuestionarioDto[]>(`${URL_API_BUSCA_ATIVA}/registros-acao/secoes`, { params });

const obterQuestionario = (questionarioId: number, registroAcaoId?: number) =>
  obterRegistro<SecaoQuestionarioDto>(
    `${URL_API_BUSCA_ATIVA}/registros-acao/questionario/${questionarioId}`,
    { params: { registroAcaoId } },
  );

const obterRegistroAcao = (registroAcaoId: number) =>
  obterRegistro<RegistroAcaoBuscaAtivaRespostaDto>(
    `${URL_API_BUSCA_ATIVA}/registros-acao/${registroAcaoId}`,
  );

const excluirRegistroAcao = (registroAcaoId: number) =>
  deletarRegistro<boolean>(`${URL_API_BUSCA_ATIVA}/registros-acao/${registroAcaoId}`);

const atualizarDadosResponsavel = (params: DadosResponsavelAtualizarDto) =>
  alterarRegistro<boolean>(`${URL_API_BUSCA_ATIVA}/criancas-estudantes/responsaveis`, params);

export default {
  salvarAtualizarRegistroAcao,
  obterSecoesDeRegistroAcao,
  obterQuestionario,
  obterRegistroAcao,
  excluirRegistroAcao,
  atualizarDadosResponsavel,
};
