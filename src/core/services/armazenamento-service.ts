import { api } from '~/servicos';
import { inserirRegistro } from './api';

const URL_DEFAULT = 'v1/armazenamento';

const fazerUploadArquivo = (formData: FormData, configuracaoHeader: any) =>
  inserirRegistro(URL_DEFAULT, formData, configuracaoHeader);

const obterArquivoParaDownload = (codigoArquivo: string) => {
  return api.get(`${URL_DEFAULT}/${codigoArquivo}`, {
    responseType: 'arraybuffer',
  });
};

export default {
  fazerUploadArquivo,
  obterArquivoParaDownload,
};
