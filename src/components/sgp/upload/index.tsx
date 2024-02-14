import UploadArquivosSME from '@/components/lib/upload';
import armazenamentoService from '@/core/services/armazenamento-service';
import { FormItemProps } from 'antd';
import { DraggerProps } from 'antd/es/upload';
import React from 'react';

type UploadArquivosCDEPProps = {
  formItemProps: FormItemProps & { name: string };
  draggerProps?: DraggerProps;
  urlUpload?: string;
};
export const UploadArquivosSGP: React.FC<UploadArquivosCDEPProps> = ({
  formItemProps,
  draggerProps,
  urlUpload,
}) => {
  const uploadService = (formData: FormData, configuracaoHeader: any) =>
    armazenamentoService.fazerUploadArquivo(formData, configuracaoHeader, urlUpload);

  return (
    <UploadArquivosSME
      formItemProps={formItemProps}
      draggerProps={draggerProps}
      tiposArquivosPermitidos=""
      uploadService={uploadService}
      downloadService={armazenamentoService.obterArquivoParaDownload}
      tamanhoMaxUploadPorArquivo={100}
    />
  );
};
