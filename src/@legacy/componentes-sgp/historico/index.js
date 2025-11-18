import { Base, CardCollapse } from '@/@legacy/componentes';
import { SGP_COLLAPSE_HISTORICO_ALTERACOES } from '@/@legacy/constantes/ids/collapse';
import { HistoricoPaginado } from './historico';

export const Historico = ({ url }) => {
  const configCabecalho = {
    altura: '44px',
    corBorda: Base.AzulBordaCollapse,
  };

  return (
    <CardCollapse
      alt={`history-alt`}
      key={`history-collapse-key`}
      titulo="Histórico de alterações"
      configCabecalho={configCabecalho}
      indice={`history-collapse-indice`}
      id={SGP_COLLAPSE_HISTORICO_ALTERACOES}
    >
      <HistoricoPaginado url={url} />
    </CardCollapse>
  );
};
