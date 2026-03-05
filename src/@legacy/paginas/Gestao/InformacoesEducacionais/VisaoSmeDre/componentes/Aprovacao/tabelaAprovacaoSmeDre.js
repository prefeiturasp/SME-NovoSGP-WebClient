import { useCallback, useEffect, useState } from 'react';
import { Table } from 'antd';
import PropTypes from 'prop-types';
import ServicoAprovacao from '~/servicos/InformacoesEducacionais/ServicoAprovacao';
import './tabelaAprovacaoSmeDre.css';

function montarColunasAgrupadas() {
  return [
    {
      title: 'Ano',
      dataIndex: 'ano',
      key: 'ano',
      fixed: 'left',
      width: 80,
      className: 'tabela-aprovacao-ano',
      render: (text, row) => {
        if (row.isHeader) {
          return {
            children: (
              <span
                style={{
                  textAlign: 'center',
                  fontWeight: 700,
                  fontSize: 16,
                  width: '100%',
                  display: 'block',
                }}
              >
                {text}
              </span>
            ),
            props: { colSpan: 4 },
          };
        }
        return text;
      },
    },
    {
      title: 'Promoções',
      dataIndex: 'promocoes',
      key: 'promocoes',
      align: 'right',

      width: 120,
      render: (value, row) =>
        row.isHeader ? { children: null, props: { colSpan: 0 } } : value,
    },
    {
      title: 'Retenções',
      children: [
        {
          title: 'Ausência',
          dataIndex: 'retencoesAusencia',
          key: 'retencoesAusencia',
          className: 'tabela-aprovacao-header-claro',
          align: 'right',
          width: 120,
          render: (value, row) =>
            row.isHeader ? { children: null, props: { colSpan: 0 } } : value,
        },
        {
          title: 'Notas',
          dataIndex: 'retencoesAprovacao',
          key: 'retencoesAprovacao',
          className: 'tabela-aprovacao-header-claro',
          align: 'right',
          width: 120,
          render: (value, row) => {
            if (row.isHeader) return { children: null, props: { colSpan: 0 } };
            if (value === 0)
              return {
                children: <span>-</span>,
                props: { className: 'tabela-aprovacao-celula-header-claro' },
              };
            return value;
          },
        },
      ],
    },
  ];
}

function prepararDados(apiData) {
  if (!apiData || apiData.length === 0) return [];
  const linhas = [];
  apiData.forEach(mod => {
    linhas.push({
      ano: mod.modalidade,
      key: `header-${mod.modalidade}`,
      isHeader: true,
      promocoes: '',
      retencoesAusencia: '',
      retencoesAprovacao: '',
    });
    mod.indicadores.forEach(serie => {
      linhas.push({
        ano: serie.serieAno + 'º',
        key: `${mod.modalidade}-${serie.serieAno}`,
        promocoes: serie.totalPromocoes,
        retencoesAusencia: serie.totalRetencoesAusencias,
        retencoesAprovacao: serie.totalRetencoesNotas,
      });
    });
  });
  return linhas;
}

function TabelaAprovacaoSmeDre({ codigoDre, codigoUe, anoLetivo }) {
  const [colunas, setColunas] = useState([]);
  const [dados, setDados] = useState([]);
  const [loading, setLoading] = useState(false);

  const obterDados = useCallback(async () => {
    if (!codigoDre || !anoLetivo) {
      setColunas([]);
      setDados([]);
      return;
    }
    setLoading(true);
    try {
      const resposta = await ServicoAprovacao.ObterDadosAprovacaoSmeDre(
        codigoDre,
        codigoUe,
        anoLetivo
      );
      const apiData =
        resposta.data && resposta.data.length ? resposta.data : [];
      setColunas(montarColunasAgrupadas());
      setDados(prepararDados(apiData));
    } catch {
      setColunas([]);
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
      <h5 className="tabela-aprovacao-custom-title">Aprovação</h5>
      <div className="line-title">
        <p className="tabela-aprovacao-custom-desc">
          É a quantidade de estudantes do ensino fundamental e médio,
          cadastrados no EOL, que foram aprovados no ano anterior.
        </p>
      </div>
      <div className="tabela-aprovacao-custom">
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

TabelaAprovacaoSmeDre.propTypes = {
  codigoDre: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  codigoUe: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  anoLetivo: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

TabelaAprovacaoSmeDre.defaultProps = {
  codigoDre: null,
  codigoUe: null,
  anoLetivo: null,
};

export default TabelaAprovacaoSmeDre;
