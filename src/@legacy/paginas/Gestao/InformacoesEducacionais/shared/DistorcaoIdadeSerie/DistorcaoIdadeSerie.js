import React, { useCallback, useEffect, useState } from 'react';
import { Table } from 'antd';
import './DistorcaoIdadeSerie.css';
import PropTypes from 'prop-types';
import { erros } from '~/servicos';
import ServicoDistorcaoIdadeSerie from '~/servicos/InformacoesEducacionais/ServicoDistorcaoIdadeSerie';

import comDefaultProps from '~/utils/comDefaultProps';
function agruparModalidadesParaTabela(apiData) {
  const tabela = [];
  apiData.forEach(modalidadeObj => {
    const modalidade = modalidadeObj.modalidade;
    const serieAno = modalidadeObj.serieAno || [];
    tabela.push({
      isHeader: true,
      modalidade,
      colSpanAno: 2,
      colSpanQtd: 0,
    });
    serieAno.forEach(item => {
      tabela.push({
        ano: item.ano,
        qtd: item.quantidadeAlunos,
        isHeader: false,
      });
    });
  });
  return tabela;
}

const columns = [
  {
    title: 'Ano',
    dataIndex: 'ano',
    key: 'ano',
    width: '50%',
    render: (text, row) => {
      if (row.isHeader) {
        return {
          children: (
            <span className="tabela-distorcao-custom-modalidade">
              {row.modalidade}
            </span>
          ),
          props: {
            colSpan: 2,
            className: 'tabela-distorcao-custom-modalidade-td',
          },
        };
      }
      return {
        children: text,
        props: { colSpan: row.colSpanAno || 1 },
      };
    },
  },
  {
    title: 'Estudantes',
    dataIndex: 'qtd',
    key: 'qtd',
    align: 'right',
    width: '50%',
    render: (text, row) => {
      if (row.isHeader) {
        return { children: null, props: { colSpan: 0 } };
      }
      return {
        children: text,
        props: { colSpan: row.colSpanQtd || 1 },
      };
    },
  },
];

function DistorcaoIdadeSerie({ codigoDre, codigoUe, anoLetivo }) {
  const [dados, setDados] = useState([]);
  const [loading, setLoading] = useState(false);

  const obterDados = useCallback(async () => {
    setLoading(true);
    try {
      const resposta =
        await ServicoDistorcaoIdadeSerie.ObterDadosDistorcaoSmeDreUe(
          codigoDre,
          codigoUe,
          anoLetivo
        );
      setDados(agruparModalidadesParaTabela(resposta.data));
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
      <h5 className="tabela-distorcao-custom-title">Distorção idade-série</h5>
      <p className="tabela-distorcao-custom-desc">
        É a quantidade de estudantes com dois ou mais anos de atraso em relação
        à série correspondente à sua idade, considerando a idade de ingresso e a
        progressão escolar esperada.
      </p>
      <div className="tabela-distorcao-custom">
        <Table
          columns={columns}
          dataSource={dados}
          loading={loading}
          pagination={false}
          bordered
          rowClassName={record => (record.bold ? 'ant-table-row-bold' : '')}
          locale={{ emptyText: 'Sem dados' }}
        />
      </div>
    </>
  );
}

DistorcaoIdadeSerie.propTypes = {
  codigoDre: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  codigoUe: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  anoLetivo: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

DistorcaoIdadeSerie.defaultProps = {
  codigoDre: null,
  codigoUe: null,
  anoLetivo: null,
};

export default comDefaultProps(DistorcaoIdadeSerie, DistorcaoIdadeSerie.defaultProps);