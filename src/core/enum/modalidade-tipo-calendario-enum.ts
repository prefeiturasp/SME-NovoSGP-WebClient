export enum ModalidadeTipoCalendarioEnum {
  FundamentalMedio = 1,
  EJA = 2,
  Infantil = 3,
  CELP = 4,
}

export const ModalidadeTipoCalendarioEnumDisplay: Record<ModalidadeTipoCalendarioEnum, string> = {
  [ModalidadeTipoCalendarioEnum.FundamentalMedio]: 'Fundamental/Médio',
  [ModalidadeTipoCalendarioEnum.EJA]: 'EJA',
  [ModalidadeTipoCalendarioEnum.Infantil]: 'Infantil',
  [ModalidadeTipoCalendarioEnum.CELP]: 'CELP',
};
