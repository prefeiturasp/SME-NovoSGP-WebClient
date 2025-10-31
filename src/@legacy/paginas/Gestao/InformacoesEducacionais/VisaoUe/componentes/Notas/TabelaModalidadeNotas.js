import { useState, useEffect, useCallback } from 'react';
import { Table } from 'antd';
import ServicoNotas from '~/servicos/InformacoesEducacionais/ServicoNotas';

function montarColunas(componentes) {
  if (!componentes || componentes.length === 0) return [];

  const colunas = [
    {
      title: 'Turma',
      dataIndex: 'nome',
      key: 'nome',
      fixed: 'left',
      width: 80,
    },
  ];

  componentes.forEach(comp => {
    colunas.push({
      title: comp,
      key: comp,
      children: [
        {
          title: 'Abaixo da média',
          dataIndex: `${comp}-abaixoDaMedia`,
          key: `${comp}-abaixoDaMedia`,
          width: 120,
          align: 'right',
        },
        {
          title: 'Acima da média',
          dataIndex: `${comp}-acimaDaMedia`,
          key: `${comp}-acimaDaMedia`,
          width: 120,
          align: 'right',
        },
      ],
    });
  });

  return colunas;
}

function prepararDados(
  items,
  modalidadeDescricao,
  modalidadeId,
  deveIncluirDescricao
) {
  const linhas = items.map((item, index) => {
    const linha = {
      nome: item.nome,
      key: `${modalidadeId}-${item.nome}-${index}`,
    };
    item.componentesCurriculares.forEach(comp => {
      linha[`${comp.nome}-abaixoDaMedia`] = comp.abaixoDaMedia;
      linha[`${comp.nome}-acimaDaMedia`] = comp.acimaDaMedia;
    });
    return linha;
  });

  if (items.length > 0 && modalidadeDescricao && deveIncluirDescricao) {
    linhas.unshift({
      key: `modalidadeDescricao-${modalidadeId}`,
      nome: modalidadeDescricao,
      isDescricao: true,
    });
  }

  return linhas;
}

function TabelaModalidadeNotas({
  dreCodigo,
  ueCodigo,
  anoLetivo,
  bimestre,
  modalidade,
}) {
  const modalidadeId = modalidade.id;

  const [dados, setDados] = useState({ items: [], totalRegistros: 0 });
  const [loading, setLoading] = useState(false);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [tamanhoPagina, setTamanhoPagina] = useState(10);

  const buscarDados = useCallback(
    async (page, pageSize) => {
      setLoading(true);
      try {
        const { data } = await ServicoNotas.ObterDadosNotasUe(
          dreCodigo,
          ueCodigo,
          anoLetivo,
          bimestre,
          modalidadeId,
          page,
          pageSize
        );
        setDados(data);
      } catch (error) {
        console.error(
          `Erro ao buscar dados da modalidade ${modalidadeId}:`,
          error
        );
        setDados({ items: [], totalRegistros: 0 });
      } finally {
        setLoading(false);
      }
    },
    [dreCodigo, ueCodigo, anoLetivo, bimestre, modalidadeId]
  );

  useEffect(() => {
    setPaginaAtual(1);
    buscarDados(1, tamanhoPagina);
  }, [bimestre, buscarDados, tamanhoPagina]);

  const onChangePaginacao = (page, pageSize) => {
    if (pageSize !== tamanhoPagina) {
      setTamanhoPagina(pageSize);
      setPaginaAtual(1);
      buscarDados(1, pageSize);
    } else {
      setPaginaAtual(page);
      buscarDados(page, pageSize);
    }
  };

  const listaItens = dados.items || [];

  const primeiroItemComComponentes = listaItens.find(
    d => d.componentesCurriculares && d.componentesCurriculares.length > 0
  );

  const componentes = [
    ...new Set(
      (primeiroItemComComponentes?.componentesCurriculares || []).map(
        c => c.nome
      )
    ),
  ];

  const modalidadeDescricao =
    listaItens.length > 0 ? listaItens[0].modalidadeDescricao : '';

  const deveIncluirDescricao = paginaAtual === 1;

  const dataSource = prepararDados(
    listaItens,
    modalidadeDescricao,
    modalidadeId,
    deveIncluirDescricao
  );

  const colunas = montarColunas(componentes);

  const colSpanCorreto = componentes.length * 2 + 1;

  return (
    <div
      className="tabela-modalidade-agrupada"
      key={modalidadeId}
      style={{ marginBottom: 32 }}
    >
      <Table
        key={`table-isolated-${modalidadeId}-${paginaAtual}-${tamanhoPagina}`}
        columns={colunas}
        dataSource={dataSource}
        loading={loading}
        bordered
        rowKey="key"
        pagination={{
          current: paginaAtual,
          pageSize: tamanhoPagina,
          total: dados.totalRegistros || 0,
          showSizeChanger: true,
          showTotal: (total, range) =>
            `${range[0]} - ${range[1]} de ${total} turmas`,
          locale: { items_per_page: '/ Página' },
          onChange: onChangePaginacao,
        }}
        locale={{ emptyText: 'Sem dados' }}
        rowClassName={record =>
          record.isDescricao ? 'linha-descricao-modalidade' : ''
        }
        components={{
          body: {
            row: ({ children, ...restProps }) => {
              const record = dataSource.find(
                d => d.key === restProps['data-row-key']
              );
              if (record?.isDescricao) {
                return (
                  <tr {...restProps}>
                    <td
                      colSpan={colSpanCorreto}
                      style={{
                        textAlign: 'center',
                        fontWeight: 600,
                        backgroundColor: '#fafafa',
                      }}
                    >
                      {record.nome}
                    </td>
                  </tr>
                );
              }
              return <tr {...restProps}>{children}</tr>;
            },
          },
        }}
      />
    </div>
  );
}

export default TabelaModalidadeNotas;
