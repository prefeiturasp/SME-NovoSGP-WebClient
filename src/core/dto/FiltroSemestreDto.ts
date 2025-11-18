import { ModalidadeEnum } from '../enum/modalidade-enum';

export type FiltroSemestreDto = {
  dreCodigo: string;
  ueCodigo: string;
  anoLetivo: number;
  modalidade: ModalidadeEnum;
};
