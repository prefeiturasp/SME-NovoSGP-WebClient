import { QuestaoDto } from './QuestaoDto';

export interface OpcaoRespostaDto {
  questoesComplementares: QuestaoDto[];
  id: number;
  ordem: number;
  nome: string;
  observacao: string;
}
