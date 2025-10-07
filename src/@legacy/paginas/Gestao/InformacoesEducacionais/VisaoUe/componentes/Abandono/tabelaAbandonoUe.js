import { useState } from 'react';
import { Table } from 'antd';
import './tabelaAbandonoUe.css';
import PropTypes from 'prop-types';

const mockDataFundamental = [
  { key: 1, turma: '1A', qtd: 0 },
  { key: 2, turma: '1B', qtd: 0 },
  { key: 3, turma: '1C', qtd: 0 },
  { key: 4, turma: '2A', qtd: 0 },
  { key: 5, turma: '2B', qtd: 2 },
  { key: 6, turma: '2C', qtd: 6 },
  { key: 7, turma: '3A', qtd: 8 },
  { key: 8, turma: '3B', qtd: 6 },
  { key: 9, turma: '3C', qtd: 10 },
  { key: 10, turma: '4A', qtd: 10 },
];

const mockDataMedio = [
  { key: 1, turma: '1A', qtd: 0 },
  { key: 2, turma: '1B', qtd: 0 },
  { key: 3, turma: '1C', qtd: 0 },
  { key: 4, turma: '2A', qtd: 0 },
  { key: 5, turma: '2B', qtd: 2 },
  { key: 6, turma: '2C', qtd: 6 },
  { key: 7, turma: '3A', qtd: 8 },
  { key: 8, turma: '3B', qtd: 6 },
  { key: 9, turma: '3C', qtd: 10 },
  { key: 10, turma: '3D', qtd: 10 },
];

const columnsFundamental = [
  {
    title: 'Turma',
    dataIndex: 'turma',
    key: 'turma',
    align: 'center',
  },
  {
    title: 'Ensino fundamental',
    children: [
      {
        title: 'Qtde de desistências',
        dataIndex: 'qtd',
        key: 'qtd',
        align: 'center',
      },
    ],
  },
];

const columnsMedio = [
  {
    title: 'Turma',
    dataIndex: 'turma',
    key: 'turma',
    align: 'center',
  },
  {
    title: 'Ensino médio',
    children: [
      {
        title: 'Qtde de desistências',
        dataIndex: 'qtd',
        key: 'qtd',
        align: 'center',
      },
    ],
  },
];

function TabelaAbandonoUe({ codigoUe, anoLetivo }) {
  const [paginaFund, setPaginaFund] = useState(1);
  const [paginaMedio, setPaginaMedio] = useState(1);

  return (
    <>
      <h5 style={{ fontWeight: 'bold', color: '#333', marginBottom: '16px' }}>
        Abandono
      </h5>
      <p
        style={{
          fontSize: '14px',
          marginBottom: '32px',
          color: '#42474a',
        }}
      >
        É a quantidade de estudantes cadastrados no EOL, do ensino infantil ao
        ensino médio, classificados como desistentes ou abandono.
      </p>
      <div style={{ width: '100%', maxWidth: 900 }}>
        <Table
          columns={columnsFundamental}
          dataSource={mockDataFundamental}
          pagination={{
            pageSize: 10,
            current: paginaFund,
            total: 120,
            showSizeChanger: false,
            onChange: setPaginaFund,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} de ${total} turmas`,
          }}
          bordered
          className="tabela-abandono-custom"
          style={{ marginBottom: 32 }}
        />
        <Table
          columns={columnsMedio}
          dataSource={mockDataMedio}
          pagination={{
            pageSize: 10,
            current: paginaMedio,
            total: 15,
            showSizeChanger: false,
            onChange: setPaginaMedio,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} de ${total} turmas`,
          }}
          bordered
          className="tabela-abandono-custom"
        />
      </div>
    </>
  );
}

TabelaAbandonoUe.propTypes = {
  codigoUe: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  anoLetivo: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

TabelaAbandonoUe.defaultProps = {
  codigoUe: null,
  anoLetivo: null,
};

export default TabelaAbandonoUe;
