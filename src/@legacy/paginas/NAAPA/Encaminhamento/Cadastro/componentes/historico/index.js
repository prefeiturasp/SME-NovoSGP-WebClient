import { Base, CardCollapse } from '@/@legacy/componentes';
import { SGP_COLLAPSE_HISTORICO_ALTERACOES_NAAPA } from '@/@legacy/constantes/ids/collapse';
import { HistoricoItem } from './historico-item';
import { Paginacao } from '@/@legacy/componentes-sgp';
import { useEffect, useState } from 'react';
import ServicoNAAPA from '@/@legacy/servicos/Paginas/Gestao/NAAPA/ServicoNAAPA';
import { useParams } from 'react-router-dom';
import { erros } from '@/@legacy/servicos';

export const HistoricoNAAPA = () => {
  const { id: encaminhamentoNAAPAId } = useParams();

  const [dadosHistorico, setDadosHistorico] = useState();
  const [numeroRegistros, setNumeroRegistros] = useState(1);
  const [numeroRegistrosPagina, setNumeroRegistrosPagina] = useState(10);

  const configCabecalho = {
    altura: '44px',
    corBorda: Base.AzulBordaCollapse,
  };

  const obterHistorico = async (paginaAtual, numeroPag) => {
    const resposta = await ServicoNAAPA.obterHistoricoPaginado(
      encaminhamentoNAAPAId,
      paginaAtual,
      numeroPag
    ).catch(e => erros(e));

    if (resposta?.data?.items) {
      setDadosHistorico(resposta.data);
      setNumeroRegistros(resposta.data.totalRegistros);
    } else {
      setDadosHistorico([]);
    }
  };

  const onChangePaginacao = async pagina => {
    obterHistorico(pagina, numeroRegistrosPagina, numeroRegistrosPagina);
  };

  const onChangeNumeroLinhas = async (paginaAtual, numeroLinhas) => {
    setNumeroRegistros(numeroLinhas);
    setNumeroRegistrosPagina(numeroLinhas);
    obterHistorico(paginaAtual, numeroLinhas);
  };

  useEffect(() => {
    if (encaminhamentoNAAPAId) {
      obterHistorico(numeroRegistros, numeroRegistrosPagina);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [encaminhamentoNAAPAId]);

  return (
    <CardCollapse
      alt={`history-alt`}
      key={`history-collapse-key`}
      titulo="Histórico de alterações"
      configCabecalho={configCabecalho}
      indice={`history-collapse-indice`}
      id={SGP_COLLAPSE_HISTORICO_ALTERACOES_NAAPA}
    >
      {dadosHistorico?.items?.map((dados, index) => {
        return <HistoricoItem key={index} historico={dados} />;
      })}

      <Paginacao
        mostrarNumeroLinhas
        locale={{ items_per_page: '' }}
        pageSize={numeroRegistrosPagina}
        numeroRegistros={numeroRegistros}
        onChangePaginacao={onChangePaginacao}
        onChangeNumeroLinhas={onChangeNumeroLinhas}
        pageSizeOptions={['10', '20', '50', '100']}
      />
    </CardCollapse>
  );
};
