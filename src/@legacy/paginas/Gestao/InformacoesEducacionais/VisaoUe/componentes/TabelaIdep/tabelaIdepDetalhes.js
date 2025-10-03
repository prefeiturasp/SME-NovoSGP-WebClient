import { Table, Tooltip } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import styles from './tabelaIdepDetalhes.css';
import CardCollapse from '~/componentes/cardCollapse';
import { Base } from '~/componentes';
import React, { useState } from 'react';

const cabecalhoDescricao = (
  <div className="cabecalho-idep">
    O Índice de Desenvolvimento da Educação Paulistana (IDEP) é uma ferramenta
    para avaliar o desempenho de escolas de Ensino Fundamental e estudantes da
    Rede Municipal de Ensino (RME). É calculado pela Secretaria Municipal de
    Educação (SME) a partir dos resultados das avaliações da Prova São Paulo e
    dos resultados das taxas de aprovação.
  </div>
);

const columns = [
  {
    title: 'Ano letivo',
    dataIndex: 'anoLetivo',
    key: 'anoLetivo',
    align: 'center',
    width: 90,
  },
  {
    title: 'IDEP',
    children: [
      {
        title: 'Anos iniciais\n(1º a 5º anos)',
        dataIndex: 'idepIniciais',
        key: 'idepIniciais',
        align: 'center',
        width: 80,
      },
      {
        title: 'Anos finais\n(6º a 9º anos)',
        dataIndex: 'idepFinais',
        key: 'idepFinais',
        align: 'center',
        width: 80,
      },
      {
        title: 'Alfabetizados',
        dataIndex: 'alfabetizados',
        key: 'alfabetizados',
        align: 'center',
        width: 90,
      },
    ],
  },
  {
    title: 'Proficência média',
    children: [
      {
        title: 'Anos iniciais\n(1º a 5º ano)',
        children: [
          {
            title: 'LP',
            dataIndex: 'profIniciaisLP',
            key: 'profIniciaisLP',
            align: 'center',
            width: 70,
          },
          {
            title: 'MT',
            dataIndex: 'profIniciaisMT',
            key: 'profIniciaisMT',
            align: 'center',
            width: 70,
          },
          {
            title: 'CN',
            dataIndex: 'profIniciaisCN',
            key: 'profIniciaisCN',
            align: 'center',
            width: 70,
          },
        ],
      },
      {
        title: 'Anos finais\n(6º a 9º ano)',
        children: [
          {
            title: 'LP',
            dataIndex: 'profFinaisLP',
            key: 'profFinaisLP',
            align: 'center',
            width: 70,
          },
          {
            title: 'MT',
            dataIndex: 'profFinaisMT',
            key: 'profFinaisMT',
            align: 'center',
            width: 70,
          },
          {
            title: 'CN',
            dataIndex: 'profFinaisCN',
            key: 'profFinaisCN',
            align: 'center',
            width: 70,
          },
        ],
      },
    ],
  },
  {
    title: 'Boletim',
    dataIndex: 'boletim',
    key: 'boletim',
    align: 'center',
    width: 70,
    render: (_, record) => (
      <Tooltip title="Visualizar boletim">
        <EyeOutlined className="boletim-icone" />
      </Tooltip>
    ),
  },
];

// Exemplo de dados mockados (ajuste para usar dados reais depois)
const dataSource = [
  {
    key: 1,
    anoLetivo: 2025,
    idepIniciais: 10,
    idepFinais: 9,
    alfabetizados: '100%',
    profIniciaisLP: 168.3,
    profIniciaisMT: 152.6,
    profIniciaisCN: 170.1,
    profFinaisLP: 170.1,
    profFinaisMT: 152.6,
    profFinaisCN: 168.3,
    boletim: '',
  },
];

export default function TabelaIdepDetalhes() {
  const [exibir, setExibir] = useState(false);
  const configCabecalho = {
    altura: '44px',
    corBorda: Base.AzulBordaCollapse,
  };
  const key = 'idep-prof-coll';
  return (
    <div className="tabela-idep-detalhes">
      <CardCollapse
        titulo="IDEP e Proficiência"
        key={`${key}-collapse-key`}
        indice={`${key}-collapse-indice`}
        alt={`${key}-alt`}
        configCabecalho={configCabecalho}
        show={exibir}
        onClick={() => setExibir(!exibir)}
      >
        {exibir && (
          <>
            {cabecalhoDescricao}
            <Table
              columns={columns}
              dataSource={dataSource}
              bordered
              pagination={false}
              size="small"
              scroll={{ x: 'max-content' }}
            />
          </>
        )}
      </CardCollapse>
    </div>
  );
}
