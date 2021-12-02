import { store } from '~/redux';
import { confirmar, history } from '~/servicos';

export const validarAcaoListao = async () => {
  const state = store.getState();
  const { listaoEmEdicao } = state.listao;

  if (listaoEmEdicao) {
    const cancelarAcao = await confirmar(
      'Atenção',
      'Você não salvou as informações preenchidas.',
      'Deseja realmente cancelar as alterações?'
    );
    return !cancelarAcao;
  }
  return false;
};

export const validarNavegacaoListao = async (e, urlDestino) => {
  e.preventDefault();
  const pararAcao = await validarAcaoListao();
  if (pararAcao) return;
  history.push(urlDestino);
};
