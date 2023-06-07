import { store } from '@/core/redux';
import { setTelaEmEdicao } from '~/redux/modulos/geral/actions';
import { confirmar } from '~/servicos';

export const verificarTelaEdicao = () => {
  const state = store.getState();
  const { telaEmEdicao } = state.geral;

  return telaEmEdicao;
};

export const validarAcaoTela = async () => {
  const { dispatch } = store;
  const telaEmEdicao = verificarTelaEdicao();

  if (telaEmEdicao) {
    const cancelarAcao = await confirmar(
      'Atenção',
      'Você não salvou as informações preenchidas.',
      'Deseja realmente cancelar as alterações?'
    );
    dispatch(setTelaEmEdicao(false));
    return !cancelarAcao;
  }
  return false;
};

export const validarNavegacaoTela = async e => {
  e.preventDefault();
  const pararAcao = await validarAcaoTela();
  if (pararAcao) return true;

  return false;
};

export const isFieldRequired = (fieldName, validationSchema) => {
  return validationSchema?.fields?.[fieldName]?._exclusive?.required;
};

export const ocultarColunaAvaliacaoComponenteRegencia = (
  componentesAvaliacao,
  componentesRegencia,
  ehRegencia
) => {
  if (
    ehRegencia &&
    componentesAvaliacao?.length &&
    componentesRegencia?.length
  ) {
    const componentesOcultar = componentesAvaliacao.filter(nomeComponente => {
      const ocultar = componentesRegencia.find(
        co => co?.nome === nomeComponente && !co?.ativo
      );
      return !!ocultar;
    });
    return componentesOcultar?.length === componentesAvaliacao?.length;
  }

  return false;
};
