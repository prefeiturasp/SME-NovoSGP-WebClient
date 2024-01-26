import { RegistroAcaoBuscaAtivaSecaoDto } from './RegistroAcaoBuscaAtivaSecaoDto';

export type RegistroAcaoBuscaAtivaDto = {
  id: number;
  turmaId: string;
  alunoCodigo: string;
  alunoNome: string;
  secoes: RegistroAcaoBuscaAtivaSecaoDto[];
};
