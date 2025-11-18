import { MapeamentoEstudanteSecaoQuestaoDto } from './MapeamentoEstudanteSecaoQuestaoDto';

export interface MapeamentoEstudanteSecaoDto {
  secaoId: number;
  concluido: boolean;
  questoes: MapeamentoEstudanteSecaoQuestaoDto[];
}
