export interface FiltroQuestoesQuestionarioMapeamentoEstudanteDto {
  questionarioId: number;
  mapeamentoEstudanteId?: number;
  codigoAluno: string;
  turmaId?: number;
  bimestre?: number | string;
}
