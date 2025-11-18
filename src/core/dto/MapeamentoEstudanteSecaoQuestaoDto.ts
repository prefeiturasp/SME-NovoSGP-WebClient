import { TipoQuestaoEnum } from '../enum/tipo-questao-enum';

export interface MapeamentoEstudanteSecaoQuestaoDto {
  respostaMapeamentoEstudanteId: number;
  questaoId: number;
  tipoQuestao: TipoQuestaoEnum;
  resposta: string;
}
