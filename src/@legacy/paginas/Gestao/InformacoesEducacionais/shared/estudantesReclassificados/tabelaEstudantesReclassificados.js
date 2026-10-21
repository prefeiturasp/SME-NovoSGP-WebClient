import React, { useCallback, useEffect, useState } from 'react';
import { Table } from 'antd';
import './tabelaEstudantesReclassificados.css';
import PropTypes from 'prop-types';
import { erros } from '~/servicos';
import ServicoEstudantesReclassificados from '~/servicos/InformacoesEducacionais/ServicoEstudantesReclassificados';

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
        ano: item.anoTurma,
        qtd: item.quantidadeAlunos,
        isHeader: false,
      });
    });
  });
  return tabela;
}

const columns = [
  {
    title: 'Ano/Série',
    dataIndex: 'ano',
    key: 'ano',
    width: '50%',
    render: (text, row) => {
      if (row.isHeader) {
        return {
          children: (
            <span className="tabela-reclassificados-custom-modalidade">
              {row.modalidade}
            </span>
          ),
          props: {
            colSpan: 2,
            className: 'tabela-reclassificados-custom-modalidade-td',
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
    title: 'Qtde de estudantes',
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

function TabelaEstudantesReclassificados({ codigoUe, codigoDre, anoLetivo }) {
  const [dados, setDados] = useState([]);
  const [loading, setLoading] = useState(false);

  const obterDados = useCallback(async () => {
    if (!anoLetivo) {
      setDados([]);
      return;
    }
    setLoading(true);
    try {
      const resposta =
        await ServicoEstudantesReclassificados.ObterDadosReclassificados(
          codigoUe,
          codigoDre,
          anoLetivo
        );
      setDados(agruparModalidadesParaTabela(resposta.data));
    } catch (error) {
      if (error.response?.data?.mensagens?.length > 0)
        erros(error.response.data.mensagens.join(', '));
      else erros('Erro ao carregar dados de reclassificação');
      setDados([]);
    } finally {
      setLoading(false);
    }
  }, [codigoDre, codigoUe, anoLetivo]);

  useEffect(() => {
    obterDados();
  }, [obterDados]);

  return (
    <>
      <h5 className="tabela-reclassificados-custom-title">
        Estudantes reclassificados
      </h5>
      <p className="tabela-reclassificados-custom-desc">
        É a quantidade de estudantes avaliados para verificar se estão na série
        adequada e, quando necessário, remanejados para a que corresponda ao seu
        nível real de aprendizagem.
      </p>
      <div className="tabela-reclassificados-custom">
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

TabelaEstudantesReclassificados.propTypes = {
  codigoDre: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  codigoUe: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  anoLetivo: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

TabelaEstudantesReclassificados.defaultProps = {
  codigoDre: null,
  codigoUe: null,
  anoLetivo: null,
};

export default comDefaultProps(TabelaEstudantesReclassificados, TabelaEstudantesReclassificados.defaultProps);