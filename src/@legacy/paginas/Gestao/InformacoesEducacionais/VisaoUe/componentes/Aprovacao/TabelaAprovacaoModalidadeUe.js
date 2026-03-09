import { useCallback, useEffect, useState } from 'react';
import { Table, Pagination } from 'antd';
import PropTypes from 'prop-types';
import ServicoAprovacao from '~/servicos/InformacoesEducacionais/ServicoAprovacao';
import './tabelaAprovacaoUe.css';

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

function prepararDadosModalidade(apiData, modalidadeId) {
  if (
    !apiData ||
    !apiData.modalidades ||
    !Array.isArray(apiData.modalidades) ||
    apiData.modalidades.length === 0
  ) {
    return [];
  }
  const modalidade =
    apiData.modalidades.find(
      m =>
        String(m.modalidadeId) === String(modalidadeId) ||
        typeof m.modalidadeId === 'undefined'
    ) || apiData.modalidades[0];

  if (!modalidade || !modalidade.turmas || modalidade.turmas.length === 0)
    return [];

  const linhas = [
    {
      ano: modalidade.modalidade,
      key: `header-${modalidade.modalidade}`,
      isHeader: true,
      promocoes: '',
      retencoesAusencia: '',
      retencoesAprovacao: '',
    },
  ];
  modalidade.turmas.forEach(turma => {
    linhas.push({
      ano: turma.turma,
      key: `${modalidade.modalidade}-${turma.turma}`,
      promocoes: turma.totalPromocoes,
      retencoesAusencia: turma.totalRetencoesAusencias,
      retencoesAprovacao: turma.totalRetencoesNotas,
    });
  });
  return linhas;
}

function TabelaAprovacaoModalidadeUe({ ueCodigo, anoLetivo, modalidadeId }) {
  const [colunas, setColunas] = useState([]);
  const [dados, setDados] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagina, setPagina] = useState(1);
  const [total, setTotal] = useState(0);

  const numeroRegistros = 10;

  const obterDados = useCallback(async () => {
    if (!ueCodigo || !anoLetivo || !modalidadeId) {
      setColunas([]);
      setDados([]);
      setTotal(0);
      return;
    }
    setLoading(true);
    try {
      const resposta = await ServicoAprovacao.ObterDadosAprovacaoUe(
        ueCodigo,
        anoLetivo,
        modalidadeId,
        pagina,
        numeroRegistros
      );
      setColunas(montarColunasAgrupadas());
      const linhas = prepararDadosModalidade(resposta.data, modalidadeId);
      setDados(linhas);
      setTotal(resposta.data?.totalRegistros || 0);
    } catch {
      setColunas([]);
      setDados([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [ueCodigo, anoLetivo, modalidadeId, pagina]);

  useEffect(() => {
    obterDados();
  }, [obterDados]);

  const handlePageChange = p => setPagina(p);

  if (!dados || dados.length < 2) return null;

  return (
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
      <Pagination
        current={pagina}
        total={total}
        pageSize={numeroRegistros}
        onChange={handlePageChange}
        style={{ marginTop: 12, textAlign: 'center' }}
      />
    </div>
  );
}

TabelaAprovacaoModalidadeUe.propTypes = {
  ueCodigo: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  anoLetivo: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  modalidadeId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

TabelaAprovacaoModalidadeUe.defaultProps = {
  ueCodigo: null,
  anoLetivo: null,
  modalidadeId: null,
};

export default TabelaAprovacaoModalidadeUe;
