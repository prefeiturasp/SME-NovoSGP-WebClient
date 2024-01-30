import { ModalidadeEnum } from '../enum/modalidade-enum';
import { OrdemProcedimentoRealizadoEnum } from '../enum/ordem-procedimento-realizado-enum';

export type FiltroRegistrosAcaoDto = {
  anoLetivo: number;
  dreId?: number;
  ueId?: number;
  turmaId?: number;
  nomeAluno: string;
  modalidade?: ModalidadeEnum;
  semestre: number;
  dataRegistroInicio?: string;
  dataRegistroFim?: string;
  ordemProcedimentoRealizado?: OrdemProcedimentoRealizadoEnum;
};
