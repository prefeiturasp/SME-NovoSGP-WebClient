import { DefaultOptionType } from 'antd/es/select';
import { ModalidadeEnum } from '../enum/modalidade-enum';

export type AbrangenciaTurmaRetornoDto = {
  ano?: string;
  anoLetivo?: number;
  codigo?: string;
  codigoModalidade?: ModalidadeEnum;
  modalidadeTurmaNome?: string;
  nome?: string;
  semetre?: number;
  ensinoEspecial?: boolean;
  id?: number;
  tipoTurma?: number;
  nomeFiltro?: string;
} & DefaultOptionType;
