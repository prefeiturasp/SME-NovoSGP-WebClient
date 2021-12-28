import _ from 'lodash';
import { store } from '~/redux';
import { erros, ServicoDiarioBordo } from '~/servicos';

const onChangeTabListao = async (tabAtiva, setTabAtual) => {
  const state = store.getState();

  const { geral } = state;
  if (geral?.telaEmEdicao && geral?.acaoTelaEmEdicao) {
    const salvou = await geral.acaoTelaEmEdicao();
    if (salvou) {
      setTabAtual(tabAtiva);
    }
  } else {
    setTabAtual(tabAtiva);
  }
};

const obterDiarioBordoListao = async (
  turmaSelec,
  periodoSelecionado,
  componenteCurricularDiarioBordoSelecionado,
  setExibirLoaderGeral,
  setDadosDiarioBordo,
  setDadosIniciaisDiarioBordo
) => {
  setExibirLoaderGeral(true);
  setDadosDiarioBordo([]);
  setDadosIniciaisDiarioBordo([]);
  const retorno = await ServicoDiarioBordo.obterDiarioBordoListao(
    turmaSelec,
    periodoSelecionado?.dataInicio,
    periodoSelecionado?.dataFim,
    componenteCurricularDiarioBordoSelecionado
  )
    .catch(e => erros(e))
    .finally(() => setExibirLoaderGeral(false));

  if (retorno?.data?.length) {
    const lista = retorno.data;

    const dadosCarregar = _.cloneDeep(lista);
    const dadosIniciais = _.cloneDeep(lista);
    setDadosDiarioBordo([...dadosCarregar]);
    setDadosIniciaisDiarioBordo([...dadosIniciais]);
  } else {
    setDadosDiarioBordo([]);
    setDadosIniciaisDiarioBordo([]);
  }

  return true;
};

export { onChangeTabListao, obterDiarioBordoListao };
