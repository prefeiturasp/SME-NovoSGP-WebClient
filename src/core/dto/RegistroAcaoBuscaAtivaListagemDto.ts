import { ModalidadeEnum } from '../enum/modalidade-enum';

export type RegistroAcaoBuscaAtivaListagemDto = {
  id: number;
  nomeTurma: string;
  modalidade: ModalidadeEnum;
  turma: string;
  nomeAluno: string;
  codigoAluno: string;
  criancaEstudante: string;
  dataRegistro: string;
  procedimentoRealizado: string;
  nomeUsuarioCriador: string;
  inseridoPor: string;
};
