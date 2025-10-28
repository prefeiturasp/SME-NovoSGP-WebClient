import React, { useCallback, useEffect, useState } from 'react';
import { Table } from 'antd';
import './tabelaEstudantesReclassificados.css';
import PropTypes from 'prop-types';
import { erros } from '~/servicos';
import ServicoEstudantesReclassificados from '~/servicos/InformacoesEducacionais/ServicoEstudantesReclassificados';

function TabelaEstudantesReclassificados({ codigoDre, codigoUe, anoLetivo }) {
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

export default TabelaEstudantesReclassificados;
