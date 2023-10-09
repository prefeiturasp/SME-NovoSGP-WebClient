export enum ModalidadeEnum {
  EducacaoInfantil = 1,
  EJA = 3,
  CIEJA = 4,
  Fundamental = 5,
  Medio = 6,
  CMCT = 7,
  MOVA = 8,
  ETEC = 9,
  CELP = 10,
}

export const ModalidadeEnumDisplay: Record<ModalidadeEnum, string> = {
  [ModalidadeEnum.EducacaoInfantil]: 'Educação Infantil',
  [ModalidadeEnum.EJA]: 'Educação de Jovens e Adultos',
  [ModalidadeEnum.CIEJA]: 'CIEJA',
  [ModalidadeEnum.Fundamental]: 'Ensino Fundamental',
  [ModalidadeEnum.Medio]: 'Ensino Médio',
  [ModalidadeEnum.CMCT]: 'CMCT',
  [ModalidadeEnum.MOVA]: 'MOVA',
  [ModalidadeEnum.ETEC]: 'ETEC',
  [ModalidadeEnum.CELP]: 'CELP',
};
