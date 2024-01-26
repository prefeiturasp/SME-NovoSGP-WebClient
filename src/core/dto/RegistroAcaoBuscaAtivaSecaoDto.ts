import { RegistroAcaoBuscaAtivaSecaoQuestaoDto } from './RegistroAcaoBuscaAtivaSecaoQuestaoDto';

export type RegistroAcaoBuscaAtivaSecaoDto = {
  questoes: RegistroAcaoBuscaAtivaSecaoQuestaoDto[];
  secaoId: number;
  concluido: boolean;
};
