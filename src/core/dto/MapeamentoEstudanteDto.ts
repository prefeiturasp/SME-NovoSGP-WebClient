import { MapeamentoEstudanteSecaoDto } from './MapeamentoEstudanteSecaoDto';

export interface MapeamentoEstudanteDto {
  id: number;
  turmaId: number;
  alunoCodigo: string;
  alunoNome: string;
  bimestre: number;
  secoes: MapeamentoEstudanteSecaoDto[];
}
