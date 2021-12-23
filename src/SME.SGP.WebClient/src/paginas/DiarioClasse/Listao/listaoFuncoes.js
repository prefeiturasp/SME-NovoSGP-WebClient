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

export { onChangeTabListao };
