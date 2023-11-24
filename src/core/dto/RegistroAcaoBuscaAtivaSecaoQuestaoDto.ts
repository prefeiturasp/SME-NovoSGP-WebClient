import { TipoQuestaoEnum } from '../enum/tipo-questao-enum';

export type RegistroAcaoBuscaAtivaSecaoQuestaoDto = {
  respostaRegistroAcaoId: number;
  questaoId: number;
  tipoQuestao: TipoQuestaoEnum;
  resposta: string;
};
