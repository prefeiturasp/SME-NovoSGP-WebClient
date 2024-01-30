import { TipoQuestionario } from '../enum/tipo-questionario-enum';
import { AuditoriaDto } from './AuditoriaDto';

export type SecaoQuestionarioDto = {
  id: number;
  nome: string;
  concluido: string;
  questionarioId: number;
  etapa: number;
  auditoria: AuditoriaDto;
  nomeComponente?: string;
  ordem: number;
  tipoQuestionario: TipoQuestionario;
};
