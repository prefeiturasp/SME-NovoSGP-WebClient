import { PlusOutlined } from '@ant-design/icons';
import { Modal, Upload } from 'antd';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Base } from '~/componentes/colors';
import Loader from '~/componentes/loader';
import { confirmar, erro, erros } from '~/servicos';
import ServicoArmazenamento from '~/servicos/Componentes/ServicoArmazenamento';
import {
  getBase64DataURL,
  obterTamanhoImagemPorArquivo,
  permiteInserirFormato,
} from '~/utils/funcoes/gerais';

const ALTURA_MINIMA = 180;
const LARGURA_MINIMA = 180;

export const ContainerUpload = styled(Upload)`
  .ant-upload-list-item-container {
    width: 100% !important;
    height: 100% !important;
    margin-block: 0 !important;
    margin-inline: 0 !important;
  }

  .ant-upload-select-picture-card {
    opacity: ${props => (props.desabilitarUpload ? 0.8 : 1)} !important;
    cursor: ${props =>
      props.desabilitarUpload ? 'not-allowed' : 'pointer'} !important;

    .ant-upload {
      pointer-events: ${props =>
        props.desabilitarUpload ? 'none' : 'auto'} !important;
    }
  }

  .ant-upload-list-picture .ant-upload-list-item-thumbnail,
  .ant-upload-list-picture-card .ant-upload-list-item-thumbnail {
    opacity: 1;
  }

  .tamanho-icone-plus {
    font-size: 20px;
  }
`;

const UploadImagens = props => {
  const {
    desabilitar,
    removerImagem,
    showUploadList,
    quantidadeMaxima,
    afterSuccessUpload,
    listaInicialImagens,
    servicoCustomRequest,
    exibirCarregarImagem,
    parametrosCustomRequest,
    tiposArquivosPermitidos,
    valorMinimoAlturaLargura,
  } = props;

  const TAMANHO_MAXIMO_UPLOAD = 5;
  const CONFIG_PADRAO_MODAL = {
    previewVisible: false,
    previewImage: '',
    previewTitle: '',
  };

  const [listaImagens, setListaImagens] = useState([]);
  const [exibirLoader, setExibirLoader] = useState(false);
  const [configModal, setConfigModal] = useState(CONFIG_PADRAO_MODAL);

  const handleCancel = () => setConfigModal(CONFIG_PADRAO_MODAL);

  const handlePreview = async dados => {
    if (dados.uid) {
      setExibirLoader(true);
      const resposta = await ServicoArmazenamento.obterArquivoParaDownload(
        dados.uid
      )
        .catch(e => erros(e))
        .finally(() => setExibirLoader(false));

      if (resposta?.data) {
        const type = resposta.headers['content-type'];
        const urlImagem = await getBase64DataURL(resposta?.data, type || '');

        setConfigModal({
          previewImage: urlImagem,
          previewVisible: true,
          previewTitle: dados.name,
        });
      }
    }
  };

  const montarListaImagensParaExibir = imagens => {
    return imagens.map(item => {
      if (!item.url && item.type && item.fileBase64) {
        item.url = `data:${item.type};base64,${item.fileBase64}`;
      }

      return { ...item, status: 'done' };
    });
  };

  useEffect(() => {
    if (listaInicialImagens?.length) {
      setListaImagens(montarListaImagensParaExibir(listaInicialImagens));
    } else {
      setListaImagens([]);
    }
  }, [listaInicialImagens]);

  const customRequest = options => {
    const { onSuccess, onError, file, onProgress } = options;

    const quantdadeAtualImagens = listaImagens?.length;
    if (quantdadeAtualImagens < quantidadeMaxima && servicoCustomRequest) {
      const fmData = new FormData();
      fmData.append('file', file);

      if (parametrosCustomRequest?.length) {
        parametrosCustomRequest.forEach(item => {
          fmData.append(item.nome, item.valor);
        });
      }

      const config = {
        headers: { 'content-type': 'multipart/form-data' },
        onUploadProgress: event => {
          onProgress({ percent: (event.loaded / event.total) * 100 }, file);
        },
      };
      setExibirLoader(true);
      servicoCustomRequest(fmData, config)
        .then(resposta => {
          onSuccess(file, resposta.data);
          if (afterSuccessUpload) {
            afterSuccessUpload(resposta.data);
          }
          setExibirLoader(false);
        })
        .catch(e => {
          setExibirLoader(false);
          onError({ event: e });
          erros(e);
        });
    } else {
      // TODO
    }
  };

  const onRemove = async dados => {
    if (removerImagem) {
      const confirmado = await confirmar(
        'Excluir',
        '',
        'Deseja realmente excluir esta imagem?'
      );
      if (confirmado) {
        removerImagem(dados?.uid);
      }
    } else {
      // TODO
    }
  };

  const excedeuLimiteMaximo = arquivo => {
    const tamanhoArquivo = arquivo.size / 1024 / 1024;
    return tamanhoArquivo > TAMANHO_MAXIMO_UPLOAD;
  };

  const validarTamanhoMinimoAlturaLargura = async arquivo => {
    const tamanhoImagem = await obterTamanhoImagemPorArquivo(arquivo);

    const ehValido =
      tamanhoImagem?.height > valorMinimoAlturaLargura?.height &&
      tamanhoImagem?.width > valorMinimoAlturaLargura?.width;

    return ehValido;
  };

  const beforeUpload = arquivo => {
    return new Promise((resolve, reject) => {
      if (!permiteInserirFormato(arquivo, tiposArquivosPermitidos)) {
        erro('Formato não permitido');
        reject(new Error(false));
      }

      if (excedeuLimiteMaximo(arquivo)) {
        erro('Tamanho máximo 5 MB');
        reject(new Error(false));
      }

      validarTamanhoMinimoAlturaLargura(arquivo)
        .then(ehValido => {
          if (!ehValido) {
            erro(
              `A resolução mínima é de ${valorMinimoAlturaLargura?.height} x ${valorMinimoAlturaLargura?.width} pixels`
            );
            reject(new Error(false));
          } else {
            resolve(true);
          }
        })
        .catch(() => {
          erro(
            `A resolução mínima é de ${valorMinimoAlturaLargura?.height} x ${valorMinimoAlturaLargura?.width} pixels`
          );
          reject(new Error(false));
        });
    });
  };

  return (
    <Loader loading={exibirLoader} tip="">
      <ContainerUpload
        onRemove={onRemove}
        disabled={desabilitar}
        fileList={listaImagens}
        listType="picture-card"
        onPreview={handlePreview}
        beforeUpload={beforeUpload}
        customRequest={customRequest}
        showUploadList={showUploadList}
        accept={tiposArquivosPermitidos}
        desabilitarUpload={listaImagens?.length >= quantidadeMaxima}
      >
        {exibirCarregarImagem && (
          <div>
            <PlusOutlined
              style={{ color: Base.Roxo }}
              className="tamanho-icone-plus"
            />
            <div style={{ marginTop: 8 }}>Carregar</div>
          </div>
        )}
      </ContainerUpload>
      <Modal
        footer={null}
        onCancel={handleCancel}
        title={configModal?.previewTitle}
        open={configModal?.previewVisible}
      >
        <img
          style={{ width: '100%' }}
          src={configModal?.previewImage}
          alt={configModal?.previewTitle}
        />
      </Modal>
    </Loader>
  );
};

UploadImagens.propTypes = {
  desabilitar: PropTypes.bool,
  removerImagem: PropTypes.func,
  quantidadeMaxima: PropTypes.number,
  afterSuccessUpload: PropTypes.func,
  servicoCustomRequest: PropTypes.func,
  exibirCarregarImagem: PropTypes.bool,
  tiposArquivosPermitidos: PropTypes.string,
  showUploadList: PropTypes.oneOfType([PropTypes.object]),
  listaInicialImagens: PropTypes.oneOfType([PropTypes.array]),
  parametrosCustomRequest: PropTypes.oneOfType([PropTypes.array]),
  valorMinimoAlturaLargura: PropTypes.oneOfType([PropTypes.object]),
};

UploadImagens.defaultProps = {
  desabilitar: false,
  removerImagem: null,
  quantidadeMaxima: 3,
  listaInicialImagens: [],
  afterSuccessUpload: null,
  servicoCustomRequest: null,
  exibirCarregarImagem: true,
  parametrosCustomRequest: [],
  tiposArquivosPermitidos: '.jpg, .jpeg, .png',
  showUploadList: {
    showRemoveIcon: true,
    showPreviewIcon: true,
    showDownloadIcon: false,
  },
  valorMinimoAlturaLargura: {
    height: ALTURA_MINIMA,
    width: LARGURA_MINIMA,
  },
};

export default UploadImagens;
