import { store } from '~/redux';
import { setListaSecoesEmEdicao } from '~/redux/modulos/encaminhamentoNAAPA/actions';
import api from '~/servicos/api';

const URL_PADRAO = 'v1/encaminhamento-naapa';

class ServicoNAAPA {
  buscarSituacoes = () => api.get(`${URL_PADRAO}/situacoes`);

  buscarPrioridades = () => api.get(`${URL_PADRAO}/prioridades`);

  obterDadosEncaminhamentoNAAPA = encaminhamentoId => {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve();
      }, 1000);
    });
  };

  obterSecoes = encaminhamentoId =>
    api.get(`${URL_PADRAO}/secoes?encaminhamentoNAAPAId=${encaminhamentoId}`);

  obterDadosQuestionarioId = (
    questionarioId,
    codigoAluno,
    codigoTurma,
    encaminhamentoId
  ) =>
    api.get(
      `${URL_PADRAO}/questionario?questionarioId=${questionarioId}&codigoAluno=${codigoAluno}&codigoTurma=${codigoTurma}&encaminhamentoId=${encaminhamentoId ||
        0}`
    );

  guardarSecaoEmEdicao = secaoId => {
    const { dispatch } = store;

    const state = store.getState();
    const { encaminhamentoNAAPA } = state;
    const { listaSecoesEmEdicao } = encaminhamentoNAAPA;

    if (listaSecoesEmEdicao?.length) {
      const listaNova = [...listaSecoesEmEdicao];
      const jaTemNaLista = listaNova.find(item => item?.secaoId === secaoId);

      if (jaTemNaLista) return;

      listaNova.push({ secaoId });
      dispatch(setListaSecoesEmEdicao(listaNova));
    } else {
      dispatch(setListaSecoesEmEdicao([{ secaoId }]));
    }
  };
}

export default new ServicoNAAPA();
