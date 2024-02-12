import UploadArquivosSME from '@/components/lib/upload';
import armazenamentoService from '@/core/services/armazenamento-service';
import { FormItemProps } from 'antd';
import { DraggerProps } from 'antd/es/upload';
import React from 'react';

type UploadArquivosCDEPProps = {
  formItemProps: FormItemProps & { name: string };
  draggerProps?: DraggerProps;
};
export const UploadArquivosSGP: React.FC<UploadArquivosCDEPProps> = ({
  formItemProps,
  draggerProps,
}) => {
  return (
    <UploadArquivosSME
      formItemProps={formItemProps}
      draggerProps={draggerProps}
      tiposArquivosPermitidos=""
      uploadService={armazenamentoService.fazerUploadArquivo}
      downloadService={armazenamentoService.obterArquivoParaDownload}
      tamanhoMaxUploadPorArquivo={100}
    />
  );
};
