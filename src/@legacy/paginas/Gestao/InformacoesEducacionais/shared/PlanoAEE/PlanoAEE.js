import React, { useEffect, useState, useCallback } from 'react';
import { Table } from 'antd';
import './PlanoAEE.css';
import PropTypes from 'prop-types';
import ServicoPlanoAEE from '~/servicos/InformacoesEducacionais/ServicoPlanoAEE';

import comDefaultProps from '~/utils/comDefaultProps';
const SITUACOES_PADRAO = [
  {
    backend: 'Aguardando atribuição de PAAI',
    coluna: 'Aguardando validação PAAI',
  },
  {
    backend: 'Aguardando parecer da coordenação',
    coluna: 'Aguardando validação do CP',
  },
  { backend: 'Aguardando parecer do CEFAI', coluna: 'Validado' },
  { backend: 'Encerrado Automaticamente', coluna: 'Encerrado' },
  { backend: 'Expirado', coluna: 'Expirado' },
];

function PlanoAEE({ codigoDre, codigoUe, anoLetivo }) {
  const [dadosTabela, setDadosTabela] = useState([]);
  const [loading, setLoading] = useState(false);

  const obterDados = useCallback(async () => {
    setLoading(true);
    try {
      const resposta = await ServicoPlanoAEE.ObterDadosPlanoAEESmeDreUe(
        codigoDre,
        codigoUe,
        anoLetivo
      );
      const resultado = resposta.data[0] || {};
      const { quantidadePlanos, planos = [] } = resultado;

      const linha = { key: 'linha', quantidadePlanos };
      SITUACOES_PADRAO.forEach(sit => {
        const plano = planos.find(p => p.situacaoPlano === sit.backend);
        linha[sit.coluna] = plano ? plano.quantidadeAlunos : '-';
      });

      setDadosTabela([linha]);
    } finally {
      setLoading(false);
    }
  }, [codigoDre, codigoUe, anoLetivo]);

  useEffect(() => {
    obterDados();
  }, [obterDados]);

  const columns = [
    {
      title: 'Qtde de planos',
      dataIndex: 'quantidadePlanos',
      key: 'qtde',
      align: 'center',
      width: 120,
    },
    {
      title: (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            borderBottom: '1px solid #e4e3f7',
          }}
        >
          Situação
        </div>
      ),
      children: SITUACOES_PADRAO.map(plan => ({
        title: plan.coluna,
        dataIndex: plan.coluna,
        key: plan.coluna,
        align: 'center',
        width: 120,
      })),
    },
  ];

  return (
    <>
      <h5 className="planoaee-title">
        Plano de Atendimento Educacional Especializado (AEE)
      </h5>
      <p className="planoaee-desc">
        É um documento pedagógico elaborado pela UE com objetivo de planejar as
        estratégias, recursos e serviços necessários para garantir a
        aprendizagem de estudantes com deficiência, transtornos globais do
        desenvolvimento e altas habilidades/superdotação.
      </p>
      <div className="planoaee-tabela">
        <Table
          columns={columns}
          dataSource={dadosTabela}
          pagination={false}
          bordered
          loading={loading}
          rowKey="key"
          locale={{ emptyText: 'Sem dados' }}
        />
      </div>
    </>
  );
}

PlanoAEE.propTypes = {
  codigoDre: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  codigoUe: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  anoLetivo: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

PlanoAEE.defaultProps = {
  codigoDre: null,
  codigoUe: null,
  anoLetivo: null,
};

export default comDefaultProps(PlanoAEE, PlanoAEE.defaultProps);