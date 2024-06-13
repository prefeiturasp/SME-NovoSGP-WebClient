import { Arquivo } from './Arquivo';

export interface RespostaQuestaoDto {
  id: number;
  opcaoRespostaId?: number;
  questaoId: number;
  arquivo: Arquivo;
  texto: string;
  periodoInicio?: string;
  periodoFim?: string;
}
