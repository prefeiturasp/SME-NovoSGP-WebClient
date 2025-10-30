import { useCallback, useEffect, useState } from 'react';
import { Table, Select } from 'antd';
import PropTypes from 'prop-types';
import ServicoNotas from '~/servicos/InformacoesEducacionais/ServicoNotas';
import './tabelaNotasSmeDre.css';
const { Option } = Select;

const bimestres = [
  { value: 1, label: '1º bimestre' },
  { value: 2, label: '2º bimestre' },
  { value: 3, label: '3º bimestre' },
  { value: 4, label: '4º bimestre' },
];

function montarColunasAgrupadas(modalidades) {
  if (!modalidades || modalidades.length === 0) return [];

  const componentesUnicos = [];
  modalidades.forEach(mod => {
    mod.serieAno.forEach(s => {
      s.componentesCurriculares.forEach(c => {
        if (!componentesUnicos.includes(c.nome)) {
          componentesUnicos.push(c.nome);
        }
      });
    });
  });

  const colunas = [
    {
      title: 'Ano',
      dataIndex: 'ano',
      key: 'ano',
      fixed: 'left',
      width: 80,
      className: 'tabela-notas-ano',
      render: (text, row) => {
        if (row.isHeader) {
          return {
            children: (
              <span
                style={{
                  textAlign: 'center',
                  fontWeight: 500,
                  fontSize: 16,
                  width: '100%',
                  display: 'block',
                }}
              >
                {text}
              </span>
            ),
            props: { colSpan: 1 + componentesUnicos.length * 2 },
          };
        }
        return text;
      },
    },
  ];

  componentesUnicos.forEach(comp => {
    colunas.push({
      title: comp,
      key: comp,
      children: [
        {
          title: 'Abaixo da média',
          dataIndex: `${comp}-abaixoDaMedia`,
          key: `${comp}-abaixoDaMedia`,
          align: 'right',
          width: 120,
          render: (value, row) =>
            row.isHeader ? { children: null, props: { colSpan: 0 } } : value,
        },
        {
          title: 'Acima da média',
          dataIndex: `${comp}-acimaDaMedia`,
          key: `${comp}-acimaDaMedia`,
          align: 'right',
          width: 120,
          render: (value, row) =>
            row.isHeader ? { children: null, props: { colSpan: 0 } } : value,
        },
      ],
    });
  });

  return colunas;
}

function prepararDados(modalidades) {
  if (!modalidades || modalidades.length === 0) return [];
  const linhas = [];
  modalidades.forEach(mod => {
    linhas.push({
      ano: mod.nome,
      key: `header-${mod.nome}`,
      isHeader: true,
    });
    mod.serieAno.forEach(serie => {
      const linha = {
        ano: serie.nome,
        key: `${mod.nome}-${serie.nome}`,
      };
      serie.componentesCurriculares.forEach(componente => {
        linha[`${componente.nome}-abaixoDaMedia`] = componente.abaixoDaMedia;
        linha[`${componente.nome}-acimaDaMedia`] = componente.acimaDaMedia;
      });
      linhas.push(linha);
    });
  });
  return linhas;
}

function TabelaNotasSmeDre({ codigoDre, codigoUe, anoLetivo }) {
  const [dadosApi, setDadosApi] = useState([]);
  const [colunas, setColunas] = useState([]);
  const [dados, setDados] = useState([]);
  const [loading, setLoading] = useState(false);
  const [bimestre, setBimestre] = useState(1);

  const obterDados = useCallback(async () => {
    if (!codigoDre || !anoLetivo) {
      setDadosApi([]);
      setColunas([]);
      setDados([]);
      return;
    }
    setLoading(true);
    try {
      const resposta = await ServicoNotas.ObterDadosNotasSmeDre(
        codigoDre,
        codigoUe,
        anoLetivo,
        bimestre
      );
      const apiData =
        resposta.data && resposta.data.length
          ? resposta.data[0].modalidades
          : [];
      setDadosApi(apiData);
      setColunas(montarColunasAgrupadas(apiData));
      setDados(prepararDados(apiData));
    } catch {
      setDadosApi([]);
      setColunas([]);
      setDados([]);
    } finally {
      setLoading(false);
    }
  }, [codigoDre, codigoUe, anoLetivo, bimestre]);

  useEffect(() => {
    obterDados();
  }, [obterDados]);

  return (
    <>
      <h5 className="tabela-notas-custom-title">Notas</h5>
      <div className="line-title">
        <p className="tabela-notas-custom-desc">
          Mostra a classificação das notas acima e abaixo da média geral,
          considerando apenas os bimestres já fechados no ano atual, para os
          componentes de Língua Portuguesa, Matemática e Ciências, em todas as
          turmas do Ensino Fundamental e Médio.
        </p>
        <div style={{ marginBottom: 16 }}>
          <Select
            value={bimestre}
            onChange={setBimestre}
            style={{ width: 140 }}
          >
            {bimestres.map(b => (
              <Option key={b.value} value={b.value}>
                {b.label}
              </Option>
            ))}
          </Select>
        </div>
      </div>
      <div className="tabela-notas-custom">
        <Table
          columns={colunas}
          dataSource={dados}
          loading={loading}
          pagination={false}
          bordered
          rowClassName={record => (record.isHeader ? 'linha-modalidade' : '')}
          locale={{ emptyText: 'Sem dados' }}
        />
      </div>
    </>
  );
}

TabelaNotasSmeDre.propTypes = {
  codigoDre: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  codigoUe: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  anoLetivo: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

TabelaNotasSmeDre.defaultProps = {
  codigoDre: null,
  codigoUe: null,
  anoLetivo: null,
};

export default TabelaNotasSmeDre;
