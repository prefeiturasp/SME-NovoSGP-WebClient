import React, { useEffect, useState } from 'react';
import { Table } from 'antd';
import PropTypes from 'prop-types';
import './EstudantesTemposIntegral.css'; // Ajuste o nome para o css novo

// Vai usar dados reais, mas pode ser mock para exemplo:
const mockApiData = [
  {
    modalidade: 'Educação Infantil',
    indicadores: [
      {
        anoSerieEtapa: 'Creche (0 a 3 anos)',
        quantidadeAlunosIntegral: 389216,
        quantidadeAlunosParcial: 9619,
      },
      {
        anoSerieEtapa: 'Pré-Escola (4 e 5 anos)',
        quantidadeAlunosIntegral: 124771,
        quantidadeAlunosParcial: 295725,
      },
    ],
  },
  {
    modalidade: 'Ensino Fundamental',
    indicadores: [
      {
        anoSerieEtapa: '1º',
        quantidadeAlunosIntegral: 40371,
        quantidadeAlunosParcial: 29796,
      },
      {
        anoSerieEtapa: '2º',
        quantidadeAlunosIntegral: 11268,
        quantidadeAlunosParcial: 52215,
      },
      {
        anoSerieEtapa: '3º',
        quantidadeAlunosIntegral: 10237,
        quantidadeAlunosParcial: 56985,
      },
      {
        anoSerieEtapa: '4º',
        quantidadeAlunosIntegral: 2579,
        quantidadeAlunosParcial: 62844,
      },
      {
        anoSerieEtapa: '5º',
        quantidadeAlunosIntegral: 2022,
        quantidadeAlunosParcial: 60599,
      },
      {
        anoSerieEtapa: '6º',
        quantidadeAlunosIntegral: 1587,
        quantidadeAlunosParcial: 54425,
      },
      {
        anoSerieEtapa: '7º',
        quantidadeAlunosIntegral: 1422,
        quantidadeAlunosParcial: 55173,
      },
      {
        anoSerieEtapa: '8º',
        quantidadeAlunosIntegral: 1507,
        quantidadeAlunosParcial: 60305,
      },
      {
        anoSerieEtapa: '9º',
        quantidadeAlunosIntegral: 1442,
        quantidadeAlunosParcial: 59349,
      },
    ],
  },
  {
    modalidade: 'Ensino Médio',
    indicadores: [
      {
        anoSerieEtapa: '1º',
        quantidadeAlunosIntegral: 746,
        quantidadeAlunosParcial: 1292,
      },
      {
        anoSerieEtapa: '2º',
        quantidadeAlunosIntegral: 310,
        quantidadeAlunosParcial: 3143,
      },
      {
        anoSerieEtapa: '3º',
        quantidadeAlunosIntegral: 241,
        quantidadeAlunosParcial: 3000,
      },
      {
        anoSerieEtapa: '4º',
        quantidadeAlunosIntegral: 0,
        quantidadeAlunosParcial: 23,
      },
    ],
  },
];

// Função para formatar milhares
function formataNumero(valor) {
  if (typeof valor !== 'number') return valor;
  return valor.toLocaleString('pt-BR');
}

// Gera as linhas da tabela agrupadas conforme print, usando diretamente o JSON da API
function montarRows(data) {
  const rows = [];
  data.forEach(grupo => {
    // Cabeçalho do grupo (exibe a modalidade)
    rows.push({
      key: `mod-${grupo.modalidade}`,
      tipo: 'header',
      modalidade: grupo.modalidade,
    });
    // Header 1 para Matrículas (agrupa colunas Integral e Parcial)
    rows.push({
      key: `mod-${grupo.modalidade}-matriculas`,
      tipo: 'matriculas',
    });
    // Subheader dinâmica (Etapa/Ano + Integral/Parcial)
    rows.push({
      key: `mod-${grupo.modalidade}-subhdr`,
      tipo: 'subheader',
      etapa: grupo.modalidade === 'Educação Infantil' ? 'Etapa' : 'Ano',
      integral: 'Integral',
      parcial: 'Parcial',
    });
    // Linhas dos indicadores
    grupo.indicadores.forEach((item, idx) => {
      rows.push({
        key: `mod-${grupo.modalidade}-${idx}-${item.anoSerieEtapa}`,
        tipo: 'item',
        etapa: item.anoSerieEtapa,
        integral: formataNumero(item.quantidadeAlunosIntegral),
        parcial: formataNumero(item.quantidadeAlunosParcial),
      });
    });
  });
  return rows;
}

const columns = [
  {
    title: '',
    dataIndex: 'etapa',
    key: 'etapa',
    align: 'center',
    width: '40%',
    render: (text, row) => {
      if (row.tipo === 'header') {
        return {
          children: <div className="ei-group-title">{row.modalidade}</div>,
          props: { colSpan: 3, className: 'ei-modalidade-header' },
        };
      }
      if (row.tipo === 'matriculas') {
        return {
          children: null,
          props: { colSpan: 1, className: 'ei-empty-cell' },
        };
      }
      if (row.tipo === 'subheader') {
        return {
          children: <span className="ei-subheader">{row.etapa}</span>,
          props: { colSpan: 1, className: 'ei-subheader-bg' },
        };
      }
      if (row.tipo === 'item') {
        return {
          children: text,
          props: { colSpan: 1 },
        };
      }
      return { children: text, props: { colSpan: 1 } };
    },
  },
  {
    title: ({ row }) => {
      if (row && row.tipo === 'matriculas') {
        return {
          children: <span className="ei-matriculas-header">Matrículas</span>,
          props: { colSpan: 2, className: 'ei-matriculas-header-bg' },
        };
      }
      return '';
    },
    dataIndex: 'integral',
    key: 'integral',
    align: 'center',
    width: '30%',
    render: (text, row, index) => {
      if (row.tipo === 'header') {
        return { children: null, props: { colSpan: 0 } };
      }
      if (row.tipo === 'matriculas') {
        return {
          children: <span className="ei-matriculas-header">Matrículas</span>,
          props: { colSpan: 2, className: 'ei-matriculas-header-bg' },
        };
      }
      if (row.tipo === 'subheader') {
        return {
          children: <span className="ei-subheader">{row.integral}</span>,
          props: { colSpan: 1, className: 'ei-subheader-bg' },
        };
      }
      if (row.tipo === 'item') {
        return { children: text, props: { colSpan: 1 } };
      }
      return { children: text, props: { colSpan: 1 } };
    },
  },
  {
    title: '',
    dataIndex: 'parcial',
    key: 'parcial',
    align: 'center',
    width: '30%',
    render: (text, row) => {
      if (row.tipo === 'header') {
        return { children: null, props: { colSpan: 0 } };
      }
      if (row.tipo === 'matriculas') {
        return { children: null, props: { colSpan: 0 } };
      }
      if (row.tipo === 'subheader') {
        return {
          children: <span className="ei-subheader">{row.parcial}</span>,
          props: { colSpan: 1, className: 'ei-subheader-bg' },
        };
      }
      if (row.tipo === 'item') {
        return { children: text, props: { colSpan: 1 } };
      }
      return { children: text, props: { colSpan: 1 } };
    },
  },
];

function EstudantesIntegral({ dadosApi }) {
  const [dados, setDados] = useState([]);
  useEffect(() => {
    setDados(montarRows(dadosApi || mockApiData));
  }, [dadosApi]);
  return (
    <>
      <h5 className="tabela-estudantes-integral-title">
        Estudantes em tempo integral
      </h5>
      <p className="tabela-estudantes-integral-desc">
        É a quantidade de estudantes cadastrados no EOL, do ensino infantil ao
        ensino médio, cadastrados no período integral.
      </p>
      <div className="tabela-estudantes-integral">
        <Table
          columns={columns}
          dataSource={dados}
          pagination={false}
          bordered
          showHeader={false}
          locale={{ emptyText: 'Sem dados' }}
          rowKey={record => record.key}
        />
      </div>
    </>
  );
}

EstudantesIntegral.propTypes = {
  codigoDre: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  codigoUe: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  anoLetivo: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

EstudantesIntegral.defaultProps = {
  codigoDre: null,
  codigoUe: null,
  anoLetivo: null,
};

export default EstudantesIntegral;
