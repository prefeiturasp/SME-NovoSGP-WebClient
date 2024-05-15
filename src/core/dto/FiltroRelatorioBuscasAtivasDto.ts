import { ModalidadeEnum } from '../enum/modalidade-enum';

export interface FiltroRelatorioBuscasAtivasDto {
  anoLetivo: number;
  dreCodigo: string;
  ueCodigo: string;
  modalidade: ModalidadeEnum;
  semestre?: number;
  turmasCodigo: string[];
  alunoCodigo: string;
  cpfABAE: string;
  dataInicioRegistroAcao?: string;
  dataFimRegistroAcao?: string;
  opcoesRespostaIdMotivoAusencia: number[];
}
