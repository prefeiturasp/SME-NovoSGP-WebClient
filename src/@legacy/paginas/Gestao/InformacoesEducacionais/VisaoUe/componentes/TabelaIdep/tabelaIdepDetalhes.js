import { Table, Tooltip, Modal } from 'antd';
import styles from './tabelaIdepDetalhes.css';
import CardCollapse from '~/componentes/cardCollapse';
import { Base } from '~/componentes';
import React, { useState } from 'react';
import { HiEye } from 'react-icons/hi';

const cabecalhoDescricao = (
  <div className="cabecalho-idep">
    O Índice de Desenvolvimento da Educação Paulistana (IDEP) é uma ferramenta
    para avaliar o desempenho de escolas de Ensino Fundamental e estudantes da
    Rede Municipal de Ensino (RME). É calculado pela Secretaria Municipal de
    Educação (SME) a partir dos resultados das avaliações da Prova São Paulo e
    dos resultados das taxas de aprovação.
  </div>
);

const mapearDadosParaTabela = (dadosJson = []) => {
  if (!Array.isArray(dadosJson)) return [];

  return dadosJson.map((item, index) => {
    const profIniciaisLP =
      item.proficiencia?.anosIniciais?.find(
        i => i.componenteCurricular === 'LP'
      )?.percentual || 0;

    const profIniciaisMT =
      item.proficiencia?.anosIniciais?.find(
        i => i.componenteCurricular === 'MT'
      )?.percentual || 0;

    const profIniciaisCN =
      item.proficiencia?.anosIniciais?.find(
        i => i.componenteCurricular === 'CN'
      )?.percentual || 0;

    const profFinaisLP =
      item.proficiencia?.anosFinais?.find(i => i.componenteCurricular === 'LP')
        ?.percentual || 0;

    const profFinaisMT =
      item.proficiencia?.anosFinais?.find(i => i.componenteCurricular === 'MT')
        ?.percentual || 0;

    const profFinaisCN =
      item.proficiencia?.anosFinais?.find(i => i.componenteCurricular === 'CN')
        ?.percentual || 0;

    return {
      key: index,
      anoLetivo: item.anoLetivo,
      percentualInicial: item.percentualInicial,
      percentualFinal: item.percentualFinal,
      profIniciaisLP,
      profIniciaisMT,
      profIniciaisCN,
      profFinaisLP,
      profFinaisMT,
      profFinaisCN,
      boletim: item.boletim,
    };
  });
};

export default function TabelaIdepDetalhes({ dados }) {
  const [exibir, setExibir] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [boletimSelecionado, setBoletimSelecionado] = useState(null);

  const abrirBoletim = record => {
    setBoletimSelecionado(record.boletim);
    setModalVisible(true);
  };

  const fecharModal = () => {
    setModalVisible(false);
    setBoletimSelecionado(null);
  };

  const dataSource = mapearDadosParaTabela(dados);
  const columns = [
    {
      title: 'Ano letivo',
      dataIndex: 'anoLetivo',
      key: 'anoLetivo',
      align: 'center',
      width: 90,
      onHeaderCell: () => ({
        className: 'coluna-anos-iniciais-finais',
      }),
    },
    {
      title: 'IDEP',
      onHeaderCell: () => ({
        className: 'coluna-anos-iniciais-finais',
      }),
      children: [
        {
          title: 'Anos iniciais\n(1º a 5º anos)',
          dataIndex: 'percentualInicial',
          key: 'percentualInicial',
          align: 'center',
          width: 80,

          render: value => (value !== undefined ? value : '-'),
        },
        {
          title: 'Anos finais\n(6º a 9º anos)',
          dataIndex: 'percentualFinal',
          key: 'percentualFinal',
          align: 'center',
          width: 80,
          onHeaderCell: () => ({
            className: styles['coluna-anos-Iniciais-Finais'],
          }),
          render: value => (value !== undefined ? value : '-'),
        },
      ],
    },
    {
      title: 'Proficência média',
      onHeaderCell: () => ({
        className: 'coluna-anos-iniciais-finais',
      }),
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

              render: value => (value !== undefined ? value : '-'),
            },
            {
              title: 'MT',
              dataIndex: 'profIniciaisMT',
              key: 'profIniciaisMT',
              align: 'center',
              width: 70,
              render: value => (value !== undefined ? value : '-'),
            },
            {
              title: 'CN',
              dataIndex: 'profIniciaisCN',
              key: 'profIniciaisCN',
              align: 'center',
              width: 70,
              render: value => (value !== undefined ? value : '-'),
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

              render: value => (value !== undefined ? value : '-'),
            },
            {
              title: 'MT',
              dataIndex: 'profFinaisMT',
              key: 'profFinaisMT',
              align: 'center',
              width: 70,
              render: value => (value !== undefined ? value : '-'),
            },
            {
              title: 'CN',
              dataIndex: 'profFinaisCN',
              key: 'profFinaisCN',
              align: 'center',
              width: 70,
              render: value => (value !== undefined ? value : '-'),
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
      onHeaderCell: () => ({
        className: 'coluna-anos-iniciais-finais',
      }),
      render: (_, record) => (
        <Tooltip title="Visualizar boletim">
          {record.boletim ? (
            <HiEye
              color="#0076BE"
              size={22}
              className="boletim-icone"
              onClick={() => abrirBoletim(record)}
              style={{ cursor: 'pointer', color: '#1890ff' }}
            />
          ) : (
            <HiEye
              color="#0076BE"
              size={22}
              className="boletim-icone"
              style={{ opacity: 0.3 }}
            />
          )}
        </Tooltip>
      ),
    },
  ];

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

      <Modal
        title="Boletim IDEP"
        open={modalVisible}
        footer={null}
        onCancel={fecharModal}
        width="80%"
        style={{ top: 20 }}
      >
        {boletimSelecionado && boletimSelecionado.endsWith('.pdf') ? (
          <iframe
            src={`https://docs.google.com/gview?url=${boletimSelecionado}&embedded=true`}
            width="100%"
            height="580px"
            title="Boletim PDF"
          ></iframe>
        ) : (
          <div className="div-img-boletim">
            <img
              src={boletimSelecionado}
              alt="Boletim"
              className="img-boletim"
            />
          </div>
        )}
      </Modal>
    </div>
  );
}
