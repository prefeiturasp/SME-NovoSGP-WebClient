import { TipoTelefone } from '../enum/tipo-telefone-enum';

export type TelefonesDto = {
  DDD?: string;
  numero?: string;
  tipoTelefone?: TipoTelefone;
};
