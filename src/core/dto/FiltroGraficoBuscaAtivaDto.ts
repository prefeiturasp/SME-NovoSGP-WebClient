import { ModalidadeEnum } from '../enum/modalidade-enum';

export type FiltroGraficoBuscaAtivaDto = {
  anoLetivo: number;
  ueId?: number;
  dreId?: number;
  modalidade: ModalidadeEnum;
  semestre?: number;
};
