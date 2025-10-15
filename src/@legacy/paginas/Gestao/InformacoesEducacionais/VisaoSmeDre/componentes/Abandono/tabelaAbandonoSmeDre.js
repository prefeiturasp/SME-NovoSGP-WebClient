import React, { useCallback, useEffect, useState } from 'react';
import { Table, Card } from 'antd';
import './tabelaAbandonoSmeDre.css';
import PropTypes from 'prop-types';
import { erros } from '~/servicos';
import ServicoAbandono from '~/servicos/InformacoesEducacionais/ServicoAbandono';

function agruparModalidadesParaTabela(modalidades) {
  const agrupado = {};
  modalidades.forEach(m => {
    if (!agrupado[m.modalidade]) agrupado[m.modalidade] = [];
    agrupado[m.modalidade].push({
      ano: m.ano,
      quantidadeDesistentes: m.quantidadeDesistentes,
    });
  });

  let data = [];
  let idx = 0;
  Object.entries(agrupado).forEach(([modalidade, anos]) => {
    anos.sort((a, b) => {
      const aNum = Number(a.ano);
      const bNum = Number(b.ano);
      if (!isNaN(aNum) && !isNaN(bNum)) return aNum - bNum;
      return String(a.ano).localeCompare(String(b.ano), 'pt-BR', {
        numeric: true,
      });
    });
    data.push({
      key: `header-${modalidade}`,
      modalidade,
      isHeader: true,
      colSpanAno: 2,
      colSpanQtd: 0,
      bold: true,
    });
    anos.forEach((item, i) => {
      data.push({
        key: `${modalidade}-${item.ano}-${i}`,
        ano: item.ano,
        qtd: item.quantidadeDesistentes,
        isHeader: false,
        colSpanAno: 1,
        colSpanQtd: 1,
        bold: false,
      });
    });
    idx++;
  });
  return data;
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
            <span
              style={{
                fontWeight: 'bold',
                textAlign: 'center',
                display: 'block',
              }}
            >
              {row.modalidade}
            </span>
          ),
          props: {
            colSpan: 2,
            style: {
              background: '#f6f5fa',
              textAlign: 'center',
              fontWeight: 'bold',
            },
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
    title: 'Qtde de desistências',
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

function TabelaAbandonoSmeDre({ codigoDre, codigoUe, anoLetivo }) {
  const [dados, setDados] = useState([]);
  const [loading, setLoading] = useState(false);

  const obterDados = useCallback(async () => {
    if (!codigoDre || !anoLetivo) {
      setDados([]);
      return;
    }
    setLoading(true);
    try {
      const resposta = await ServicoAbandono.ObterDadosAbandonoSmeDre(
        codigoDre,
        codigoUe,
        anoLetivo
      );
      let modalidades = [];
      if (Array.isArray(resposta.data)) {
        resposta.data.forEach(item => {
          if (Array.isArray(item.modalidades)) {
            modalidades = modalidades.concat(item.modalidades);
          }
        });
      }
      setDados(agruparModalidadesParaTabela(modalidades));
    } catch (error) {
      if (error.response?.data?.mensagens?.length > 0)
        erros(error.response.data.mensagens.join(', '));
      else erros('Erro ao carregar dados do Abandono');
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
      <h5 className="tabela-abandono-custom-title">Abandono</h5>
      <p className="tabela-abandono-custom-desc">
        É a quantidade de estudantes cadastrados no EOL, do ensino infantil ao
        ensino médio, classificados como desistentes ou abandono.
      </p>
      <div className="tabela-abandono-custom">
        <Table
          columns={columns}
          dataSource={dados}
          loading={loading}
          pagination={false}
          bordered
          rowClassName={record => (record.bold ? 'ant-table-row-bold' : '')}
        />
      </div>
    </>
  );
}

TabelaAbandonoSmeDre.propTypes = {
  codigoDre: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  codigoUe: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  anoLetivo: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

TabelaAbandonoSmeDre.defaultProps = {
  codigoDre: null,
  codigoUe: null,
  anoLetivo: null,
};

export default TabelaAbandonoSmeDre;
