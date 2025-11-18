export enum BimestreEnum {
  BIMESTRE_1 = '1',
  BIMESTRE_2 = '2',
  BIMESTRE_3 = '3',
  BIMESTRE_4 = '4',
  BIMESTRE_FINAL = 'FINAL',
}

export const BimestreEnumDisplay: Record<BimestreEnum, string> = {
  [BimestreEnum.BIMESTRE_1]: '1º Bimestre',
  [BimestreEnum.BIMESTRE_2]: '2º Bimestre',
  [BimestreEnum.BIMESTRE_3]: '3º Bimestre',
  [BimestreEnum.BIMESTRE_4]: '4º Bimestre',
  [BimestreEnum.BIMESTRE_FINAL]: 'Final',
};
