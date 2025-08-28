import { Cabecalho } from '~/componentes-sgp';
import {
  Col,
  Row,
  Modal,
  Progress,
  Tooltip,
  Drawer,
  Table,
  Spin,
  Card,
} from 'antd';
import BotaoExcluirPadrao from '~/componentes-sgp/BotoesAcaoPadrao/botaoExcluirPadrao';
import BotaoVoltarPadrao from '~/componentes-sgp/BotoesAcaoPadrao/botaoVoltarPadrao';
import {
  SGP_BUTTON_ALTERAR_CADASTRAR,
  SGP_BUTTON_CANCELAR,
} from '~/constantes/ids/button';
import { ROUTES } from '@/core/enum/routes';
import React, { useContext, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Colors } from '~/componentes';
import {
  confirmar,
  erros,
  ServicoFechamentoReabertura,
  sucesso,
  verificaSomenteConsulta,
} from '~/servicos';
import { ListaPaginada } from '~/componentes';
import ModalImportarArquivo from './ModalImportarArquivo';
import styled from 'styled-components';
import {
  SearchOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';
import api from '~/servicos/api';

const StyledModalWrapper = styled.div`
  .ant-modal {
    padding-top: 32px !important;
    z-index: 1050 !important;
  }
  .ant-modal-wrap {
    z-index: 1050 !important;
  }
  .ant-modal-mask {
    z-index: 1050 !important;
  }
  && .ant-modal-header {
    margin-top: 12px;
  }
`;

function ImportacaoDeDados() {
  const navigate = useNavigate();
  const [listaKey, setListaKey] = useState(0);

  const renderStatusIcon = dados => {
    const { statusImportacao, totalRegistros, registrosProcessados } = dados;

    if (
      statusImportacao === 'Processado com sucesso' &&
      totalRegistros === registrosProcessados
    ) {
      return (
        <CheckCircleOutlined
          style={{ color: 'green', fontSize: 18, marginLeft: 8 }}
        />
      );
    }

    if (
      statusImportacao === 'Processado com falhas' &&
      totalRegistros !== registrosProcessados
    ) {
      return (
        <CloseCircleOutlined
          style={{ color: 'red', fontSize: 18, marginLeft: 8 }}
        />
      );
    }

    return (
      <ClockCircleOutlined
        style={{ color: 'gray', fontSize: 18, marginLeft: 8 }}
      />
    );
  };

  const colunas = [
    {
      title: 'Arquivo',
      dataIndex: 'nomeArquivo',
    },
    {
      title: 'Status',
      dataIndex: 'statusImportacao',
      render: (_, dados) => <span>{dados.statusImportacao}</span>,
    },
    {
      title: 'Total Registros',
      dataIndex: 'totalRegistros',
    },
    {
      title: 'Total Processados',
      dataIndex: 'registrosProcessados',
      render: (valor, dados) => {
        const percent =
          dados.totalRegistros > 0 ? (valor / dados.totalRegistros) * 100 : 0;

        return (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span
              style={{
                color: erros > 0 ? 'black' : 'black',
                fontWeight: 500,
                padding: 4,
              }}
            >
              {dados.registrosProcessados}
            </span>
            <Progress
              percent={percent}
              showInfo={false}
              strokeColor="#9254de"
              style={{ flex: 1 }}
            />
            {renderStatusIcon(dados)}
          </div>
        );
      },
    },
    {
      title: 'Ação',
      dataIndex: 'acao',
      render: (_, dados) => {
        const isErro = dados.statusImportacao === 'Processado com falhas';

        return (
          <Tooltip title={isErro ? 'Ver detalhes' : 'Sem detalhes'}>
            <SearchOutlined
              style={{
                fontSize: 18,
                color: isErro ? '#1677ff' : '#ccc',
                cursor: isErro ? 'pointer' : 'not-allowed',
                border: `1px solid ${isErro ? '#1677ff' : '#f0f0f0'}`,
                borderRadius: 6,
                padding: 6,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s',
              }}
              onClick={() => isErro && abrirDrawer(dados)}
            />
          </Tooltip>
        );
      },
    },
  ];

  const [drawerVisible, setDrawerVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [inconsistencias, setInconsistencias] = useState([]);
  const [arquivoSelecionado, setArquivoSelecionado] = useState(null);
  const [paginaAtual, setPaginaAtual] = useState(1); // 👈 aqui
  const [totalRegistros, setTotalRegistros] = useState(0);
  const pageSize = 20;

  const carregarInconsistencias = async (registro, page = 1) => {
    if (registro) setArquivoSelecionado(registro);
    setLoading(true);
    try {
      const resposta = await api.get(`v1/importar-arquivo/falhas`, {
        params: {
          ImportacaoLogId: registro?.id || arquivoSelecionado?.id,
          numeroPagina: page,
          numeroRegistros: pageSize,
        },
      });

      setInconsistencias(resposta.data.items || []);
      setTotalRegistros(resposta.data.totalRegistros || 0);
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };

  const abrirDrawer = registro => {
    setDrawerVisible(true);
    carregarInconsistencias(registro, 1);
  };

  const colunasInconsistencias = [
    {
      title: 'Linha',
      dataIndex: 'linhaArquivo',
      width: '20%',
      render: value => <>{value ?? '-'}</>,
    },
    {
      title: 'Erro',
      dataIndex: 'motivoFalha',
      width: '80%',
      render: value => <>{value ?? 'Erro não informado'}</>,
    },
  ];

  const [openModal, setOpenModal] = useState(false);

  return (
    <StyledModalWrapper>
      {openModal ? (
        <Modal
          open
          centered
          destroyOnClose
          footer={null}
          onCancel={() => setOpenModal(false)}
          width={'70%'}
          style={{ overflowY: 'auto', zIndex: 1050 }}
        >
          <ModalImportarArquivo
            setarModal={setOpenModal}
            resetarLita={setListaKey}
          />
        </Modal>
      ) : (
        <></>
      )}
      <Drawer
        title={'Importações com inconsistências'}
        placement="right"
        width={700}
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
        maskClosable={true}
        destroyOnClose={true}
        zIndex={1000}
        headerStyle={{ marginTop: 80 }}
      >
        {arquivoSelecionado?.nomeArquivo && (
          <div style={{ marginBottom: 16, fontWeight: 500 }}>
            <b>Arquivo:</b> {arquivoSelecionado.nomeArquivo}
          </div>
        )}

        <Table
          rowKey="linhaArquivo"
          columns={colunasInconsistencias}
          dataSource={inconsistencias || []}
          components={{
            body: {
              cell: ({ children, ...restProps }) => (
                <td {...restProps} style={{ padding: '12px 16px' }}>
                  {children}
                </td>
              ),
            },
          }}
          pagination={{
            current: paginaAtual,
            total: totalRegistros,
            pageSize: 20,
            onChange: page => {
              setPaginaAtual(page);
              carregarInconsistencias(arquivoSelecionado, page);
            },
          }}
        />
      </Drawer>
      <Cabecalho pagina="Importação de Dados">
        <Col span={24}>
          <Row gutter={[8, 8]} type="flex">
            <Col>
              <BotaoVoltarPadrao onClick={() => navigate(ROUTES.PRINCIPAL)} />
            </Col>
            <Col>
              <Button
                id={SGP_BUTTON_ALTERAR_CADASTRAR}
                icon="arrows-rotate"
                label={'Atualizar Dados'}
                color={Colors.Roxo}
                border
                bold
                onClick={() => setListaKey(prev => prev + 1)}
              />
            </Col>
            <Col>
              <Button
                id={SGP_BUTTON_ALTERAR_CADASTRAR}
                icon="upload"
                label={'Importar Arquivo'}
                color={Colors.Roxo}
                border
                bold
                onClick={() => setOpenModal(true)}
              />
            </Col>
          </Row>
        </Col>
      </Cabecalho>
      <Card>
        <ListaPaginada
          key={listaKey}
          url="v1/importar-arquivo"
          id="lista-eventos"
          colunas={colunas}
          temPaginacao={true}
        />
      </Card>
    </StyledModalWrapper>
  );
}

export default ImportacaoDeDados;
