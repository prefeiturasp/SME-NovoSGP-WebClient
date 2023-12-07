export enum OrdemProcedimentoRealizadoEnum {
  Telefone = 1,
  VisitaDomiciliar = 2,
}

export const OrdemProcedimentoRealizadoEnumDisplay: Record<OrdemProcedimentoRealizadoEnum, string> =
  {
    [OrdemProcedimentoRealizadoEnum.Telefone]: 'Ligação telefônica',
    [OrdemProcedimentoRealizadoEnum.VisitaDomiciliar]: 'Visita Domiciliar',
  };
