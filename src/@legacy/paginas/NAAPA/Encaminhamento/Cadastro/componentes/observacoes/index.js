import { Base, CardCollapse } from '@/@legacy/componentes';
import { SGP_COLLAPSE_OBSERVACOES } from '@/@legacy/constantes/ids/collapse';
import { ObservacoesPaginado } from './observacoes';

export const Observacoes = () => {
  const configCabecalho = {
    altura: '44px',
    corBorda: Base.AzulBordaCollapse,
  };

  return (
    <CardCollapse
      titulo="Observações"
      alt={`observacoes-alt`}
      key={`observacoes-collapse-key`}
      configCabecalho={configCabecalho}
      id={SGP_COLLAPSE_OBSERVACOES}
      indice={`observacoes-collapse-indice`}
    >
      <ObservacoesPaginado />
    </CardCollapse>
  );
};
