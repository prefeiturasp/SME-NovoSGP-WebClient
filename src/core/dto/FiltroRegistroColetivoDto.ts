export type FiltroRegistroColetivoDto = {
  dreId: number;
  ueId?: number;
  dataReuniaoInicio?: string;
  dataReuniaoFim?: string;
  tiposReuniaoId: number[];
};
