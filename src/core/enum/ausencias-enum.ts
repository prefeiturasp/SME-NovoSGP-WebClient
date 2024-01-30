export enum AusenciasEnum {
  NoDiaDeHoje = 1,
  Ha2DiasSeguidos = 2,
  Ha3DiasSeguidos = 3,
  Ha4DiasSeguidos = 4,
  Ha5DiasSeguidos = 5,
  Entre6e10DiasSeguidos = 6,
  Entre11e15DiasSeguidos = 7,
  HaMaisDe15DiasSeguidos = 8,
  TresAusenciasNosUltimos10Dias = 9,
}

export const AusenciasEnumDisplay: Record<AusenciasEnum, string> = {
  [AusenciasEnum.NoDiaDeHoje]: 'No dia de hoje',
  [AusenciasEnum.Ha2DiasSeguidos]: 'Há 2 dias seguidos',
  [AusenciasEnum.Ha3DiasSeguidos]: 'Há 3 dias seguidos',
  [AusenciasEnum.Ha4DiasSeguidos]: 'Há 4 dias seguidos',
  [AusenciasEnum.Ha5DiasSeguidos]: 'Há 5 dias seguidos',
  [AusenciasEnum.Entre6e10DiasSeguidos]: 'Entre 6 e 10 dias seguidos',
  [AusenciasEnum.Entre11e15DiasSeguidos]: 'Entre 11 e 15 dias seguidos',
  [AusenciasEnum.HaMaisDe15DiasSeguidos]: 'Há mais de 15 dias seguidos',
  [AusenciasEnum.TresAusenciasNosUltimos10Dias]: '3 ausências nos últimos 10 dias',
};
