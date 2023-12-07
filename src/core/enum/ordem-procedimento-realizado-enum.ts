export enum OrdemProcedimentoRealizadoEnum {
  Nenhum = 0,
  Telefone = 1,
  VisitaDomiciliar = 2,
}

export const OrdemProcedimentoRealizadoEnumDisplay: Record<OrdemProcedimentoRealizadoEnum, string> =
  {
    [OrdemProcedimentoRealizadoEnum.Nenhum]: 'Nenhum',
    [OrdemProcedimentoRealizadoEnum.Telefone]: 'Ligação telefônica',
    [OrdemProcedimentoRealizadoEnum.VisitaDomiciliar]: 'Visita Domiciliar',
  };
