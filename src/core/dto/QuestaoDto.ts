import { TipoQuestaoEnum } from '../enum/tipo-questao-enum';
import { OpcaoRespostaDto } from './OpcaoRespostaDto';
import { RespostaQuestaoDto } from './RespostaQuestaoDto';

export interface QuestaoDto {
  id: number;
  ordem: number;
  nome: string;
  observacao: string;
  obrigatorio: boolean;
  somenteLeitura: boolean;
  tipoQuestao: TipoQuestaoEnum;
  opcionais: string;
  opcaoResposta: OpcaoRespostaDto[];
  resposta: RespostaQuestaoDto[];
  dimensao: number;
  tamanho?: number;
  mascara?: string;
  placeHolder?: string;
  nomeComponente?: string;
}
