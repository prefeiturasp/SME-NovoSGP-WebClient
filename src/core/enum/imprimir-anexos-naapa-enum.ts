export enum ImprimirAnexosNAAPAEnum {
  Nao = 1,
  ApenasEncaminhamento = 2,
  ApenasAtendimentos = 3,
  EncaminhamentoAtendimentos = 4,
}

export const ImprimirAnexosNAAPAEnumDisplay: Record<ImprimirAnexosNAAPAEnum, string> = {
  [ImprimirAnexosNAAPAEnum.Nao]: 'Não',
  [ImprimirAnexosNAAPAEnum.ApenasEncaminhamento]: 'Apenas encaminhamento',
  [ImprimirAnexosNAAPAEnum.ApenasAtendimentos]: 'Apenas atendimentos',
  [ImprimirAnexosNAAPAEnum.EncaminhamentoAtendimentos]: 'Encaminhamento e Atendimentos',
};
