import { HistoricoItem } from './historico-item';
import { Paginacao } from '@/@legacy/componentes-sgp';
import { useEffect, useState } from 'react';
import { api, erros } from '@/@legacy/servicos';

export const HistoricoPaginado = ({ url }) => {
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [dadosHistorico, setDadosHistorico] = useState();
  const [numeroRegistros, setNumeroRegistros] = useState(1);
  const [numeroRegistrosPagina, setNumeroRegistrosPagina] = useState(10);

  const obterHistorico = async (numeroPagina, numeroRegistros) => {
    const resposta = await api
      .get(
        `${url}?numeroPagina=${numeroPagina}&numeroRegistros=${numeroRegistros}`
      )
      .catch(e => erros(e));

    if (resposta?.data?.items) {
      setDadosHistorico(resposta.data.items);
      setNumeroRegistros(resposta.data.totalRegistros);
    } else {
      setDadosHistorico([]);
    }
  };

  const onChangePaginacao = async pagina => {
    setPaginaAtual(pagina);
    obterHistorico(pagina, numeroRegistrosPagina);
  };

  const onChangeNumeroLinhas = async (paginaAtual, numeroLinhas) => {
    setNumeroRegistros(numeroLinhas);
    setNumeroRegistrosPagina(numeroLinhas);
    obterHistorico(paginaAtual, numeroLinhas);
  };

  useEffect(() => {
    obterHistorico(paginaAtual, numeroRegistrosPagina);
  }, []);

  return (
    <>
      {dadosHistorico?.map((dados, index) => {
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
    </>
  );
};
