import { Modal, Table, Tooltip } from 'antd';
import { useEffect, useState } from 'react';
import { HiDownload, HiEye } from 'react-icons/hi';
import { Base } from '~/componentes';
import CardCollapseCustomized from '../../../shared/cardCollapseCustomized';
import styles from '../TabelaIdep/tabelaIdepDetalhes.css';

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

export default function TabelaIdepAnosAnterioresDetalhes({ dados }) {
  const [exibir, setExibir] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [boletimSelecionado, setBoletimSelecionado] = useState(null);

  const abrirBoletim = record => {
    const url = record.boletim?.trim();
    const urlWithHttps = url.startsWith('https') ? url : 'https://' + url;
    setBoletimSelecionado(urlWithHttps);
  };

  useEffect(() => {
    if (boletimSelecionado) setModalVisible(true);
  }, [boletimSelecionado]);

  const fecharModal = () => {
    setModalVisible(false);
    setBoletimSelecionado(null);
  };

  const downloadBoletim = async url => {
    if (!url) return;

    try {
      url = url.startsWith('https') ? url : 'https://' + url;
      const response = await fetch(url);
      if (!response.ok) throw new Error('Erro ao baixar arquivo.');

      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = blobUrl;
      const filename = url.split('/').pop() || 'boletim-idep';
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      error('Falha ao baixar boletim:');
    }
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
          title: (
            <span>
              Anos iniciais
              <br />
              (1º a 5º anos)
            </span>
          ),
          dataIndex: 'percentualInicial',
          key: 'percentualInicial',
          align: 'center',
          width: 80,

          render: value => (value !== undefined ? value : '-'),
        },
        {
          title: (
            <span>
              Anos finais
              <br />
              (6º a 9º anos)
            </span>
          ),
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
          title: (
            <span>
              Anos iniciais
              <br />
              (1º a 5º anos)
            </span>
          ),

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
          title: (
            <span>
              Anos finais
              <br />
              (6º a 9º anos)
            </span>
          ),
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
        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
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
          <Tooltip title="Baixar boletim">
            {record.boletim ? (
              <HiDownload
                color="#4CAF50"
                size={22}
                className="boletim-download-icone"
                onClick={() => downloadBoletim(record.boletim)}
                style={{ cursor: 'pointer' }}
              />
            ) : (
              <HiDownload
                color="#4CAF50"
                size={22}
                className="boletim-download-icone"
                style={{ opacity: 0.3 }}
              />
            )}
          </Tooltip>
        </div>
      ),
    },
  ];

  const key = 'idep-prof-coll';

  return (
    <div className="tabela-idep-detalhes">
      <CardCollapseCustomized
        titulo="Ver anos anteriores"
        aberto={exibir} // ✅ substitui show
        aoClicar={() => setExibir(!exibir)} // ✅ substitui onClick
        key={`${key}-collapse-modern`}
        alturaCabecalho="44px"
        corCabecalho={Base.CinzaBordaCollapse}
      >
        <>
          <Table
            columns={columns}
            dataSource={dataSource}
            bordered
            pagination={false}
            size="small"
            scroll={{ x: 'max-content' }}
          />
        </>
      </CardCollapseCustomized>

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
            src={boletimSelecionado}
            width="100%"
            height="580px"
            title="Boletim PDF"
          ></iframe>
        ) : (
          <div className="div-img-boletim">
            <label>Imagem</label>
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
