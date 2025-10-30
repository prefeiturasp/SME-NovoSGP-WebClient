import CardCollapse from '~/componentes/cardCollapse';
import ServicoNotas from '~/servicos/InformacoesEducacionais/ServicoNotas';
import { useState, useEffect, useRef } from 'react';
import { Table, Select, Pagination } from 'antd';
import { Base } from '~/componentes';
import './tabelaNotasUE.css';

const bimestres = [
  { value: 1, label: '1º bimestre' },
  { value: 2, label: '2º bimestre' },
  { value: 3, label: '3º bimestre' },
  { value: 4, label: '4º bimestre' },
];

function montarColunas(componentes) {
  if (!componentes || componentes.length === 0) return [];
  const colunas = [
    {
      title: 'Ano',
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

function prepararDados(items, componentes) {
  return items.map(item => {
    const linha = {
      nome: item.nome,
      key: item.nome,
    };
    item.componentesCurriculares.forEach(comp => {
      linha[`${comp.nome}-abaixoDaMedia`] = comp.abaixoDaMedia;
      linha[`${comp.nome}-acimaDaMedia`] = comp.acimaDaMedia;
    });
    return linha;
  });
}

function TabelaNotasUe({ dreCodigo, ueCodigo, anoLetivo }) {
  const configCabecalho = {
    altura: '44px',
    corBorda: Base.AzulBordaCollapse,
  };

  const [modalidades, setModalidades] = useState([]);
  const [bimestre, setBimestre] = useState(1);
  const [dadosPorModalidade, setDadosPorModalidade] = useState({});
  const [paginas, setPaginas] = useState({});
  const [loading, setLoading] = useState({});
  // Mantém colapse sempre aberto ao mudar página
  const [colapseAtivo, setColapseAtivo] = useState(true);

  useEffect(() => {
    async function carregarModalidades() {
      const { data } = await ServicoNotas.ObterModalidadesUe(
        ueCodigo,
        anoLetivo,
        bimestre
      );
      setModalidades(data || []);
    }
    if (ueCodigo && anoLetivo && bimestre) {
      carregarModalidades();
    }
  }, [ueCodigo, anoLetivo, bimestre]);

  useEffect(() => {
    modalidades.forEach(modalidade => {
      buscarDadosModalidade(modalidade.id, paginas[modalidade.id] || 1);
    });
  }, [modalidades, bimestre, anoLetivo, ueCodigo, dreCodigo]);

  async function buscarDadosModalidade(modalidadeId, pagina) {
    setLoading(load => ({ ...load, [modalidadeId]: true }));
    const { data } = await ServicoNotas.ObterDadosNotasUe(
      dreCodigo,
      ueCodigo,
      anoLetivo,
      bimestre,
      modalidadeId,
      pagina
    );
    setDadosPorModalidade(dados => ({ ...dados, [modalidadeId]: data }));
    setLoading(load => ({ ...load, [modalidadeId]: false }));
  }

  function onChangePagina(modalidadeId, pagina) {
    setPaginas(pags => ({ ...pags, [modalidadeId]: pagina }));
    buscarDadosModalidade(modalidadeId, pagina);
    // Garante o collapse sempre ativo (antidote para colapse que fecha em updates)
    setColapseAtivo(true);
  }

  return (
    <CardCollapse
      titulo="Notas"
      configCabecalho={configCabecalho}
      ativo={colapseAtivo}
      onToggle={ativo => setColapseAtivo(ativo)}
    >
      <div className="line-title">
        <p className="tabela-notas-custom-desc">
          Mostra a classificação das notas acima e abaixo da média geral,
          considerando apenas os bimestres já fechados no ano atual, para os
          componentes de Língua Portuguesa, Matemática e Ciências, em todas as
          turmas agrupadas por modalidade.
        </p>
        <div style={{ marginBottom: 16 }}>
          <Select
            value={bimestre}
            onChange={setBimestre}
            style={{ width: 140 }}
          >
            {bimestres.map(b => (
              <Select.Option key={b.value} value={b.value}>
                {b.label}
              </Select.Option>
            ))}
          </Select>
        </div>
      </div>
      {modalidades.map(modalidade => {
        const dadosApi = dadosPorModalidade[modalidade.id];
        const dados = dadosApi?.items || [];
        const modalidadeDescricao = dados[0]?.modalidadeDescricao || '';
        const componentes = [
          ...new Set(
            (dados[0]?.componentesCurriculares || []).map(c => c.nome)
          ),
        ];
        // Soma o total de colunas mesclando todas!
        const colSpanTotal = 1 + componentes.length * 2;

        // Construção do header mesclado da descrição
        const tableHeader = (
          <thead>
            <tr>
              <th
                colSpan={colSpanTotal}
                style={{
                  textAlign: 'center',
                  background: '#f5f5f5',
                  fontWeight: 'bold',
                  fontSize: 16,
                }}
              >
                {modalidade.nome}
              </th>
            </tr>
            <tr>
              <th
                colSpan={colSpanTotal}
                style={{
                  textAlign: 'center',
                  background: '#fafafa',
                  fontStyle: 'italic',
                  borderBottom: '1px solid #e8e8e8',
                }}
              >
                {modalidadeDescricao}
              </th>
            </tr>
          </thead>
        );
        // Customiza o componente table para inserir o header especial
        const components = {
          header: {
            wrapper: props => (
              <>
                {tableHeader}
                {props.children.slice(2)}
              </>
            ),
          },
        };

        return (
          <div
            className="tabela-modalidade-agrupada"
            key={modalidade.id}
            style={{ marginBottom: 32 }}
          >
            <Table
              columns={montarColunas(componentes)}
              dataSource={prepararDados(dados, componentes)}
              loading={loading[modalidade.id]}
              pagination={false}
              bordered
              rowKey="key"
              locale={{ emptyText: 'Sem dados' }}
              components={components}
            />
            <Pagination
              current={paginas[modalidade.id] || 1}
              pageSize={dadosApi?.registrosPorPagina || 10}
              total={dadosApi?.totalRegistros || 0}
              onChange={page => onChangePagina(modalidade.id, page)}
              style={{ marginTop: 16, textAlign: 'right' }}
            />
          </div>
        );
      })}
    </CardCollapse>
  );
}

export default TabelaNotasUe;
