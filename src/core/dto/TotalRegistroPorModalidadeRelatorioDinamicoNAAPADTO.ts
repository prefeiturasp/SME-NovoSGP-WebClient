import { ModalidadeEnum } from '../enum/modalidade-enum';

export type TotalRegistroPorModalidadeRelatorioDinamicoNAAPADTO = {
  total: number;
  modalidade: ModalidadeEnum;
  ano: string;
  descricaoAno: string;
};
