export enum OrdenacaoListEncaminhamentoNAAPAEnum {
  UE = 1,
  Estudante = 2,
  DataEntradaQueixa = 3,
  UEDesc = -1,
  EstudanteDesc = -2,
  DataEntradaQueixaDesc = -3,
}

export const OrdenacaoListEncaminhamentoNAAPAEnumDisplay: Record<
  OrdenacaoListEncaminhamentoNAAPAEnum,
  string
> = {
  [OrdenacaoListEncaminhamentoNAAPAEnum.UE]: 'Unidade Escolar (UE)',
  [OrdenacaoListEncaminhamentoNAAPAEnum.Estudante]: 'Criança/Estudante',
  [OrdenacaoListEncaminhamentoNAAPAEnum.DataEntradaQueixa]: 'Data da entrada da queixa',
  [OrdenacaoListEncaminhamentoNAAPAEnum.UEDesc]: 'Unidade Escolar (UE) decrescente',
  [OrdenacaoListEncaminhamentoNAAPAEnum.EstudanteDesc]: 'Criança/Estudante decrescente',
  [OrdenacaoListEncaminhamentoNAAPAEnum.DataEntradaQueixaDesc]:
    'Data da entrada da queixa decrescente',
};
