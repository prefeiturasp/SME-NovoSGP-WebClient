import { InboxOutlined } from '@ant-design/icons';
import { Form, FormItemProps, Upload } from 'antd';
import { DraggerProps, RcFile, UploadFile } from 'antd/es/upload';

import React from 'react';
import styled from 'styled-components';
import { erro, sucesso } from '~/servicos';

const { Dragger } = Upload;

enum HttpStatusCode {
  Ok = 200,
}

export const permiteInserirFormato = (arquivo: any, tiposArquivosPermitidos: string) => {
  if (tiposArquivosPermitidos?.trim()) {
    const listaPermitidos = tiposArquivosPermitidos
      .split(',')
      .map((tipo) => tipo?.trim()?.toLowerCase());

    const tamanhoNome = arquivo?.name?.length;

    const permiteTipo = listaPermitidos.find((tipo) => {
      const nomeTipoAtual = arquivo.name.substring(tamanhoNome, tamanhoNome - tipo.length);

      if (nomeTipoAtual) {
        return tipo?.toLowerCase() === nomeTipoAtual?.toLowerCase();
      }

      return false;
    });

    return !!permiteTipo;
  }
  return true;
};

const downloadBlob = (data: any, fileName: string) => {
  const a = document.createElement('a');
  document.body.appendChild(a);
  a.setAttribute('style', 'display: none');

  const blob = new Blob([data]);
  const url = window.URL.createObjectURL(blob);
  a.href = url;
  a.download = fileName;
  a.click();
  window.URL.revokeObjectURL(url);

  document.body.removeChild(a);
};

type ContainerDraggerUploadProps = {
  readOnly: boolean;
};
export const ContainerDraggerUpload = styled(Dragger)<ContainerDraggerUploadProps>`
  &.ant-upload-wrapper
    .ant-upload-list
    .ant-upload-list-item
    .ant-upload-list-item-actions
    .ant-upload-list-item-action {
    opacity: 1;
  }

  .ant-upload-btn {
    pointer-events: ${(props) => (props.readOnly ? 'none' : 'auto')} !important;
    opacity: ${(props) => (props.readOnly ? '0.6' : '1')} !important;
  }

  .ant-upload-drag {
    cursor: ${(props) => (props.readOnly ? 'not-allowed' : 'pointer')} !important;
  }
`;

type UploadArquivosProps = {
  draggerProps?: DraggerProps;
  formItemProps: FormItemProps & { name: string };
  tiposArquivosPermitidos?: string;
  tamanhoMaxUploadPorArquivo?: number;
  downloadService: (codigosArquivo: string) => any;
  uploadService: (formData: FormData, configuracaoHeader: any) => any;
};

const TAMANHO_PADRAO_MAXIMO_UPLOAD = 100;

const UploadArquivosSME: React.FC<UploadArquivosProps> = (props) => {
  const form = Form.useFormInstance();

  const {
    draggerProps,
    formItemProps,
    uploadService,
    downloadService,
    tiposArquivosPermitidos = '',
    tamanhoMaxUploadPorArquivo = TAMANHO_PADRAO_MAXIMO_UPLOAD,
  } = props;

  if (!formItemProps.name) {
    formItemProps.name = 'arquivos';
  }

  const listaDeArquivos = Form.useWatch(formItemProps.name, form);

  const setNovoValor = (novoMap: any) => {
    if (form && form.setFieldValue) {
      form.setFieldValue(formItemProps.name, novoMap);
    }
  };

  const excedeuLimiteMaximo = (arquivo: File) => {
    const tamanhoArquivo = arquivo.size / 1024 / 1024;

    return tamanhoArquivo > tamanhoMaxUploadPorArquivo;
  };

  const beforeUploadDefault = (arquivo: RcFile) => {
    if (!permiteInserirFormato(arquivo, tiposArquivosPermitidos)) {
      erro('Formato não permitido');
      return false;
    }

    if (excedeuLimiteMaximo(arquivo)) {
      erro(`Tamanho máximo ${tamanhoMaxUploadPorArquivo}MB`);
      return false;
    }

    return true;
  };

  const customRequestDefault = (options: any) => {
    const { onSuccess, onError, file, onProgress } = options;

    const fmData = new FormData();

    const config = {
      headers: { 'content-type': 'multipart/form-data' },
      onUploadProgress: (event: any) => {
        onProgress({ percent: (event.loaded / event.total) * 100 }, file);
      },
    };

    fmData.append('file', file);

    uploadService(fmData, config)
      .then((resposta: any) => {
        if (resposta?.status === HttpStatusCode.Ok || resposta?.sucesso) {
          const codigo =
            resposta?.data?.codigo || resposta?.dados?.codigo || resposta.data || resposta.dados;
          const id = resposta?.data?.id || resposta?.dados?.id;
          file.id = id;
          onSuccess(file, codigo);
        } else {
          onError({});
        }
      })
      .catch((e: any) => onError({ event: e }));
  };

  const onRemoveDefault = async (arquivo: UploadFile<any>) => {
    if (arquivo.xhr) {
      sucesso(`Arquivo ${arquivo.name} excluído com sucesso`);
      return true;
    }
    return false;
  };

  const atualizaListaArquivos = (fileList: any, file: UploadFile<any>) => {
    const novaLista = fileList.filter((item: any) => item.uid !== file.uid);
    const novoMap = [...novaLista];

    setNovoValor(novoMap);
  };

  const onChangeDefault = ({ file, fileList }: any) => {
    const { status } = file;

    if (excedeuLimiteMaximo(file)) {
      atualizaListaArquivos(fileList, file);
      return;
    }

    if (!permiteInserirFormato(file, tiposArquivosPermitidos)) {
      atualizaListaArquivos(fileList, file);
      return;
    }

    const novoMap = [...fileList]?.filter((f) => f?.status !== 'removed');

    if (status === 'done') {
      sucesso(`${file.name} arquivo carregado com sucesso`);
    } else if (status === 'error') {
      atualizaListaArquivos(fileList, file);
      return;
    }

    if (status === 'done' || status === 'removed') {
      if (form && form.setFieldValue) {
        form.setFieldValue(formItemProps.name, novoMap);
      }
    }

    setNovoValor(novoMap);
  };

  const onDownloadDefault = (arquivo: UploadFile<any>) => {
    const codigoArquivo = arquivo.xhr;
    downloadService(codigoArquivo)
      .then((resposta: any) => {
        downloadBlob(resposta.data, arquivo.name);
      })
      .catch(() => erro('Erro ao tentar fazer download'));
  };

  const normFile = (e: any) => {
    if (Array.isArray(e)) {
      return e;
    }
    return listaDeArquivos;
  };

  return (
    <Form.Item valuePropName="fileList" getValueFromEvent={normFile} {...formItemProps}>
      <ContainerDraggerUpload
        name="file"
        listType="text"
        readOnly={!!draggerProps?.disabled}
        fileList={listaDeArquivos}
        showUploadList={{ showDownloadIcon: true, showRemoveIcon: !draggerProps?.disabled }}
        onRemove={draggerProps?.onRemove || onRemoveDefault}
        onChange={draggerProps?.onChange || onChangeDefault}
        onDownload={draggerProps?.onDownload || onDownloadDefault}
        beforeUpload={draggerProps?.beforeUpload || beforeUploadDefault}
        customRequest={draggerProps?.customRequest || customRequestDefault}
        {...draggerProps}
        disabled={false}
      >
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">Clique ou arraste para fazer o upload do arquivo</p>
        <p className="ant-upload-hint">{`Deve permitir apenas arquivos com no máximo ${tamanhoMaxUploadPorArquivo}MB cada`}</p>
      </ContainerDraggerUpload>
    </Form.Item>
  );
};

export default UploadArquivosSME;
