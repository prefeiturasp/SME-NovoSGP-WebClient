import React, { useEffect, useState, useCallback } from 'react';
import { Table } from 'antd';
import './PlanoAEE.css';
import PropTypes from 'prop-types';

const mockData = {
  quantidadePlanos: 3478,
  planos: [
    { situacao: 'Aguardando validação PAAI', quantidade: 865 },
    { situacao: 'Aguardando validação do CP', quantidade: 712 },
    { situacao: 'Validado', quantidade: 632 },
    { situacao: 'Encerrado', quantidade: 893 },
    { situacao: 'Expirado', quantidade: 376 },
  ],
};

function PlanoAEE({ codigoDre, codigoUe, anoLetivo }) {
  const [dadosTabela, setDadosTabela] = useState([]);
  const [loading, setLoading] = useState(false);

  const obterDados = useCallback(async () => {
    setLoading(true);
    try {
      const { quantidadePlanos, planos } = mockData;

      const linha = {
        key: 'unique_key',
        quantidadePlanos,
        ...planos.reduce((acc, curr) => {
          acc[curr.situacao] = curr.quantidade;
          return acc;
        }, {}),
      };
      setDadosTabela([linha]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    obterDados();
  }, [obterDados]);

  const columns = [
    {
      title: 'Qtde de planos',
      dataIndex: 'quantidadePlanos',
      key: 'qtde',
      align: 'center',
      render: value => ({
        children: value,
        props: { rowSpan: 1 },
      }),
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
      children: mockData.planos.map(plan => ({
        title: plan.situacao,
        dataIndex: plan.situacao,
        key: plan.situacao,
        align: 'center',
        render: quantidade => quantidade,
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

export default PlanoAEE;
