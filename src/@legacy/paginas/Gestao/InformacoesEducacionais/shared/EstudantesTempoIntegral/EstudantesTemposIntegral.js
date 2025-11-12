import React, { useCallback, useEffect, useState } from 'react';
import { Table } from 'antd';
import PropTypes from 'prop-types';
import './EstudantesTemposIntegral.css';
import ServicoEstudantesTempoIntegral from '~/servicos/InformacoesEducacionais/ServicoEstudantesTempoIntegral';

function formataNumero(valor) {
  if (typeof valor !== 'number') return valor;
  return valor.toLocaleString('pt-BR');
}

function montarRows(data) {
  const rows = [];
  data.forEach(grupo => {
    rows.push({
      key: `mod-${grupo.modalidade}`,
      tipo: 'header',
      modalidade: grupo.modalidade,
    });
    rows.push({
      key: `mod-${grupo.modalidade}-matriculas`,
      tipo: 'matriculas',
    });
    rows.push({
      key: `mod-${grupo.modalidade}-subhdr`,
      tipo: 'subheader',
      etapa: grupo.modalidade === 'Educação Infantil' ? 'Etapa' : 'Ano',
      integral: 'Integral',
      parcial: 'Parcial',
    });
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

function EstudantesIntegral({ codigoDre, codigoUe, anoLetivo }) {
  const [dados, setDados] = useState([]);
  const [loading, setLoading] = useState(false);

  const obterDados = useCallback(async () => {
    setLoading(true);
    try {
      const resposta =
        await ServicoEstudantesTempoIntegral.ObterDadosEstudantesTempoIntegralSmeDreUe(
          codigoDre,
          codigoUe,
          anoLetivo
        );
      setDados(montarRows(resposta.data));
    } catch (error) {
    } finally {
      setLoading(false);
    }
  }, [codigoDre, codigoUe, anoLetivo]);

  useEffect(() => {
    obterDados();
  }, [obterDados]);

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
          loading={loading}
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
