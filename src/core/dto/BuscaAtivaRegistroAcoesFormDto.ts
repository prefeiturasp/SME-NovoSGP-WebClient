import { AbrangenciaDreRetornoDto } from './AbrangenciaDreRetornoDto';
import { AlunoSimplesDto } from './AlunoSimplesDto';

export type BuscaAtivaRegistroAcoesFormDto = {
  consideraHistorico: boolean;
  dre: AbrangenciaDreRetornoDto & { label?: string; value?: string };
  ue: any;
  semestre?: any;
  turma: any;
  anoLetivo: any;
  modalidade: any;
  localizadorEstudante: AlunoSimplesDto;
  localizadorEstudanteDados: AlunoSimplesDto[];
};
