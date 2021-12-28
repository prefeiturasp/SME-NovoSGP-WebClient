import { store } from '~/redux';

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

const montarIdsObjetivosSelecionadosListao = planos => {
  planos.forEach(plano => {
    if (plano?.objetivosAprendizagemComponente?.length) {
      let ids = [];
      plano.objetivosAprendizagemComponente.forEach(objetivo => {
        const idsObjetivo = objetivo.objetivosAprendizagem.map(ob => ob.id);
        ids = ids.concat(idsObjetivo);
      });
      plano.idsObjetivosAprendizagemSelecionados = ids;
    }
  });
};

export { onChangeTabListao, montarIdsObjetivosSelecionadosListao };
