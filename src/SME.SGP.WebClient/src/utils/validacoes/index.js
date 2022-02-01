import { store } from '~/redux';
import { confirmar, history } from '~/servicos';

export const validarAcaoTela = async () => {
  const state = store.getState();
  const { telaEmEdicao } = state.geral;

  if (telaEmEdicao) {
    const cancelarAcao = await confirmar(
      'Atenção',
      'Você não salvou as informações preenchidas.',
      'Deseja realmente cancelar as alterações?'
    );
    return !cancelarAcao;
  }
  return false;
};

export const validarNavegacaoTela = async (e, urlDestino) => {
  e.preventDefault();
  const pararAcao = await validarAcaoTela();
  if (pararAcao) return true;

  history.push(urlDestino);

  return false;
};
