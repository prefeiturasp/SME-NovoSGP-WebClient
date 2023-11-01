import { ModalidadeEnum } from '@/core/enum/modalidade-enum';
import api from '~/servicos/api';

const URL_PADRAO = 'v1/relatorio-dinamico-naapa';

class ServicoRelatorioDinamicoNAAPA {
  obterDados = (params: any, numeroPagina: number, numeroRegistros: number) => {
    const url = `${URL_PADRAO}?numeroPagina=${numeroPagina}&numeroRegistros=${numeroRegistros}`;
    return api.post(url, params);
  };

  obterQuestoes = (modalidade: ModalidadeEnum) =>
    api.get(`${URL_PADRAO}/questoes?modalidadeId=${modalidade}`);
}

export default new ServicoRelatorioDinamicoNAAPA();
