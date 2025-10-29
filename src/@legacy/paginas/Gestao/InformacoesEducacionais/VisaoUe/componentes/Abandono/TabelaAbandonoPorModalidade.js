import React, { useEffect, useState, useCallback } from 'react';
import { Table } from 'antd';
import ServicoAbandono from '~/servicos/InformacoesEducacionais/ServicoAbandono';
import PropTypes from 'prop-types';
import './tabelaAbandonoUe.css';

function TabelaAbandonoPorModalidade({
  modalidade,
  codigoUe,
  codigoDre,
  anoLetivo,
}) {
  const [dados, setDados] = useState([]);
  const [pagina, setPagina] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [totalRegistros, setTotalRegistros] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchData = useCallback(async () => {
    if (!anoLetivo || !codigoUe || !modalidade) {
      setDados([]);
      setTotalPaginas(1);
      setTotalRegistros(0);
      return;
    }
    setLoading(true);
    try {
      const resposta = await ServicoAbandono.ObterDadosAbandonoUe({
        anoLetivo,
        codigoDre,
        codigoUe,
        modalidade,
        numeroPagina: pagina,
        numeroRegistros: 10,
      });
      const data = resposta.data?.modalidades || [];
      setDados(
        data.map((item, idx) => ({
          key: `${item.turma || idx}`,
          turma: item.turma,
          qtd: item.quantidadeDesistentes,
        }))
      );
      setTotalPaginas(Number(resposta.data?.totalPaginas) || 1);
      setTotalRegistros(Number(resposta.data?.totalRegistros) || data.length);
    } catch {
      setDados([]);
      setTotalPaginas(1);
      setTotalRegistros(0);
    } finally {
      setLoading(false);
    }
  }, [anoLetivo, codigoUe, codigoDre, modalidade, pagina]);

  useEffect(() => {
    setPagina(1);
  }, [anoLetivo, codigoUe, codigoDre, modalidade]);

  useEffect(() => {
    fetchData();
  }, [fetchData, pagina]);

  const dataWithHeader = [
    {
      key: 'modalidade-header',
      modalidadeHeader: true,
      turma: null,
      qtd: null,
    },
    ...dados,
  ];

  const columns = [
    {
      title: 'Turma',
      dataIndex: 'turma',
      key: 'turma',
      align: 'center',
      width: '50%',
      render: (text, row) => {
        if (row.modalidadeHeader) {
          return {
            children: (
              <span className="tabela-abandono-custom-title-center">
                {modalidade}
              </span>
            ),
            props: {
              colSpan: 2,
              className: 'tabela-abandono-custom-modalidade-td',
            },
          };
        }
        return text;
      },
    },
    {
      title: 'Qtde de desistências',
      dataIndex: 'qtd',
      key: 'qtd',
      align: 'center',
      width: '50%',
      render: (text, row) => {
        if (row.modalidadeHeader) {
          return { children: null, props: { colSpan: 0 } };
        }
        return text;
      },
    },
  ];

  if (totalRegistros === 0) {
    return <></>;
  }

  return (
    <div className="tabela-abandono-custom tabela-abandono-custom-full">
      <Table
        columns={columns}
        dataSource={dataWithHeader}
        pagination={{
          pageSize: 10,
          current: pagina,
          total: totalRegistros,
          showSizeChanger: false,
          onChange: setPagina,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} de ${total} turmas`,
        }}
        bordered
        loading={loading}
      />
    </div>
  );
}

TabelaAbandonoPorModalidade.propTypes = {
  modalidade: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    .isRequired,
  codigoUe: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    .isRequired,
  codigoDre: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  anoLetivo: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    .isRequired,
};

export default TabelaAbandonoPorModalidade;
