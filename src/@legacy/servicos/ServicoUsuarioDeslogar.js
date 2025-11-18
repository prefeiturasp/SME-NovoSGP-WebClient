import { store } from '@/core/redux';
import { limparDadosFiltro } from '~/redux/modulos/filtro/actions';
import { Deslogar } from '~/redux/modulos/usuario/actions';
import { LimparSessao } from '~/redux/modulos/sessao/actions';

const deslogarPorSessaoInvalida = () => {
  store.dispatch(limparDadosFiltro());
  store.dispatch(Deslogar());
  store.dispatch(LimparSessao());
};

export { deslogarPorSessaoInvalida };
