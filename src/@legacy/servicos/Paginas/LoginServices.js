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
import {
  setDadosFiltroAutenticacao,
  setLimparTurmaFiltroAutenticacao,
} from '../../redux/modulos/dadosAutenticacaoFrequencia/actions';

class LoginService {
  autenticar = async props => {
    const login = props?.login;
    const acessoAdmin = props?.acessoAdmin;
    const deslogar = props?.deslogar;
    const integracaoToken = props?.integracaoToken;

    const endpoint = () => {
      if (acessoAdmin) {
        return api.put(`v1/autenticacao/suporte/${login.usuario}`, {
          login: login.usuario,
          senha: login.senha,
        });
      }

      if (deslogar) {
        return api.put(`v1/autenticacao/suporte/deslogar`, {
          login: login.usuario,
          senha: login.senha,
        });
      }

      if (integracaoToken) {
        return api.post(
          `/v1/autenticacao/integracoes/frequencia/${integracaoToken}`
        );
      }

      return api.post(this.obtenhaUrlAutenticacao(), {
        login: login.usuario,
        senha: login.senha,
      });
    };

    const validarAutenticar = (limparDadosSuporte = false) =>
      endpoint()
        .then(res => {
          let dados = null;

          if (integracaoToken) {
            dados = res.data.usuarioAutenticacao;
          } else {
            dados = res.data;
          }

          const token = dados?.token;
          store.dispatch(salvarToken(token));

          if (limparDadosSuporte || integracaoToken) {
            localStorage.clear();
            store.dispatch(limparDadosFiltro());
            store.dispatch(Deslogar());
            store.dispatch(removerTurma());
            store.dispatch(setLimparTurmaFiltroAutenticacao());
          }

          if (dados && dados?.perfisUsuario) {
            const { perfis } = dados?.perfisUsuario;
            const selecionado = perfis.find(
              perfil =>
                perfil.codigoPerfil === dados?.perfisUsuario.perfilSelecionado
            );
            store.dispatch(setarPerfis(perfis));
            store.dispatch(perfilSelecionado(selecionado));
            store.dispatch(setTrocouPerfil(true));
          }

          if (integracaoToken) {
            const turmaFrequencia = {
              turma: res.data?.turma,
              componenteCurricularCodigo: res.data?.componenteCurricularCodigo,
            };
            store.dispatch(setDadosFiltroAutenticacao(turmaFrequencia));
          }

          return {
            sucesso: true,
            mensagem: 'Usuario logado com sucesso',
            dados,
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
