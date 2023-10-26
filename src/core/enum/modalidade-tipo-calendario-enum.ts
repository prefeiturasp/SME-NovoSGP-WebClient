export enum ModalidadeTipoCalendarioEnum {
  FUNDAMENTAL_MEDIO = 1,
  EJA = 2,
  INFANTIL = 3,
  CELP = 4,
}

export const ModalidadeTipoCalendarioEnumDisplay: Record<ModalidadeTipoCalendarioEnum, string> = {
  [ModalidadeTipoCalendarioEnum.FUNDAMENTAL_MEDIO]: 'Fundamental/Médio',
  [ModalidadeTipoCalendarioEnum.EJA]: 'EJA',
  [ModalidadeTipoCalendarioEnum.INFANTIL]: 'Infantil',
  [ModalidadeTipoCalendarioEnum.CELP]: 'CELP',
};
