import { api } from '~/servicos';
import { inserirRegistro } from './api';

const URL_DEFAULT = 'v1/armazenamento';

const fazerUploadArquivo = (formData: FormData, configuracaoHeader: any, url?: string) =>
  inserirRegistro(url || URL_DEFAULT, formData, configuracaoHeader);

const obterArquivoParaDownload = (codigoArquivo: string, url?: string) => {
  return api.get(`${url || URL_DEFAULT}/${codigoArquivo}`, {
    responseType: 'arraybuffer',
  });
};

export default {
  fazerUploadArquivo,
  obterArquivoParaDownload,
};
