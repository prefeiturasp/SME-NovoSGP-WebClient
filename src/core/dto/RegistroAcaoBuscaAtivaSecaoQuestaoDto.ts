import { TipoQuestaoEnum } from '../enum/tipo-questao-enum';

export type RegistroAcaoBuscaAtivaSecaoQuestaoDto = {
  respostaEncaminhamentoId?: number;
  respostaRegistroAcaoId: number;
  questaoId: number;
  tipoQuestao: TipoQuestaoEnum;
  resposta: string;
};
