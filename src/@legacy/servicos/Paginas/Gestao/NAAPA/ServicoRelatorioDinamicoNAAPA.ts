import { ModalidadeEnum } from '@/core/enum/modalidade-enum';
import queryString from 'query-string';
import api from '~/servicos/api';

const URL_PADRAO = 'v1/relatorio-dinamico-naapa';

class ServicoRelatorioDinamicoNAAPA {
  obterDados = (params: any, numeroPagina: number, numeroRegistros: number) => {
    const url = `${URL_PADRAO}?numeroPagina=${numeroPagina}&numeroRegistros=${numeroRegistros}`;
    return api.post(url, params);
  };

  obterQuestoes = (modalidadesId: ModalidadeEnum[]) =>
    api.get(`${URL_PADRAO}/questoes`, {
      params: {
        modalidadesId,
      },
      paramsSerializer: {
        serialize: (params) => {
          return queryString.stringify(params, {
            skipEmptyString: true,
            skipNull: true,
          });
        },
      },
    });
}

export default new ServicoRelatorioDinamicoNAAPA();
