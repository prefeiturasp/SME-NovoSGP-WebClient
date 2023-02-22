import { store } from '~/redux';
import { setListaPadraoMotivoAusencia } from '~/redux/modulos/modalAnotacaoFrequencia/actions';
import api from '~/servicos/api';

const urlPadrao = '/v1/anotacoes/alunos';

class ServicoAnotacaoFrequenciaAluno {
  obterMotivosAusencia = () => {
    return api.get(`${urlPadrao}/motivos-ausencia`);
  };

  obterMotivosAusenciaRedux = async () => {
    const { dispatch } = store;
    const state = store.getState();
    const { modalAnotacaoFrequencia } = state;
    const { listaPadraoMotivoAusencia } = modalAnotacaoFrequencia;

    if (listaPadraoMotivoAusencia?.length) return;

    const resposta = await api.get(`${urlPadrao}/motivos-ausencia`);
    if (resposta?.data?.length) {
      dispatch(setListaPadraoMotivoAusencia(resposta.data));
    } else {
      dispatch(setListaPadraoMotivoAusencia([]));
    }
  };

  obterAnotacao = (codigoAluno, aulaId) => {
    const url = `${urlPadrao}/${codigoAluno}/aulas/${aulaId}`;
    return api.get(url);
  };

  obterAnotacaoPorId = id => {
    const url = `${urlPadrao}/${id}`;
    return api.get(url);
  };

  salvarAnotacao = params => {
    return api.post(urlPadrao, params);
  };

  alterarAnotacao = params => {
    return api.put(`${urlPadrao}/${params.id}`, params);
  };

  deletarAnotacao = id => {
    return api.delete(`${urlPadrao}/${id}`);
  };
}

export default new ServicoAnotacaoFrequenciaAluno();
