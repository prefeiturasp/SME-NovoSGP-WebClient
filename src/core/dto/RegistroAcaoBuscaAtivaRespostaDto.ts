import { ModalidadeEnum } from '../enum/modalidade-enum';
import { AlunoTurmaReduzidoDto } from './AlunoTurmaReduzidoDto';

export type RegistroAcaoBuscaAtivaRespostaDto = {
  dreId: number;
  dreNome: string;
  dreCodigo: string;
  ueId: number;
  ueNome: string;
  ueCodigo: string;
  turmaId: number;
  turmaNome: string;
  turmaCodigo: string;
  anoLetivo: number;
  aluno?: AlunoTurmaReduzidoDto;
  modalidade: ModalidadeEnum;
  semestre?: number;
};
