import api from '../api';
import { store } from '@/core/redux';
import {
  perfilSelecionado,
  setarPerfis,
  setTrocouPerfil,
} from '~/redux/modulos/perfil/actions';
import { limparDadosFiltro } from '~/redux/modulos/filtro/actions';
import {
  Deslogar,
  removerTurma,
  salvarToken,
} from '~/redux/modulos/usuario/actions';

class LoginService {
  autenticar = async (Login, acessoAdmin, deslogar) => {
    const endpoint = acessoAdmin
      ? api.put(`v1/autenticacao/suporte/${Login.usuario}`)
      : deslogar
      ? api.put(`v1/autenticacao/suporte/deslogar`)
      : api.post(this.obtenhaUrlAutenticacao(), {
          login: Login.usuario,
          senha: Login.senha,
        });

    const validarAutenticar = (limparDadosSuporte = false) =>
      endpoint
        .then(res => {
          const token = res?.data?.token;
          store.dispatch(salvarToken(token));

          if (limparDadosSuporte) {
            localStorage.clear();
            store.dispatch(limparDadosFiltro());
            store.dispatch(Deslogar());
            store.dispatch(removerTurma());
          }

          if (res.data && res.data.perfisUsuario) {
            const { perfis } = res.data.perfisUsuario;
            const selecionado = perfis.find(
              perfil =>
                perfil.codigoPerfil === res.data.perfisUsuario.perfilSelecionado
            );
            store.dispatch(setarPerfis(perfis));
            store.dispatch(perfilSelecionado(selecionado));
            store.dispatch(setTrocouPerfil(true));
          }
          return {
            sucesso: true,
            mensagem: 'Usuario logado com sucesso',
            dados: res.data,
          };
        })
        .catch(err => {
          if (acessoAdmin) return { sucesso: false, erro: err };

          const status = err.response ? err.response.status : null;

          if (status && status === 401)
            return { sucesso: false, erroGeral: 'Usuário e/ou senha inválida' };

          return {
            sucesso: false,
            erroGeral:
              err.response && err.response.data && err.response.data.mensagens
                ? err.response.data.mensagens.join(',')
                : 'Falha ao tentar autenticar no servidor',
          };
        });

    const limparDadosSuporte = acessoAdmin || deslogar;

    return validarAutenticar(limparDadosSuporte);
  };

  obtenhaUrlAutenticacao = () => {
    return 'v1/autenticacao';
  };
}

export default new LoginService();
