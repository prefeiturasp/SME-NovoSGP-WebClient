import { TipoTelefone } from '../enum/tipo-telefone-enum';

export type TelefonesDto = {
  ddd?: string;
  numero?: string;
  tipoTelefone?: TipoTelefone;
};
