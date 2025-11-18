import { CopiarSecaoDto } from './CopiarPapDto';
import { CopiarPapEstudantesDto } from './CopiarPapEstudantesDto';

export interface CopiarPapDto {
  periodoRelatorioPAPId: number;
  codigoTurmaOrigem: string;
  codigoAlunoOrigem: string;
  codigoTurma: string;
  estudantes: CopiarPapEstudantesDto[];
  secoes: CopiarSecaoDto[];
}
