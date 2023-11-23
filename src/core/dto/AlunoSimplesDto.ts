import { ModalidadeEnum } from '../enum/modalidade-enum';

export type AlunoSimplesDto = {
  codigo: string;
  numeroChamada: number;
  nome: string;
  codigoTurma?: string;
  turmaId: number;
  nomeComModalidadeTurma: string;
  modalidadeCodigo?: ModalidadeEnum;
  semestre?: number;
};
