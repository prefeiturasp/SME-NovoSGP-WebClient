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
  setDadosFiltroAutenticacaoFrequencia,
  setLimparTurmaFiltroAutenticacaoFrequencia,
} from '../../redux/modulos/turmaFiltroAutenticacaoFrequencia/actions';

class LoginService {
  autenticar = async props => {
    const login = props?.login;
    const acessoAdmin = props?.acessoAdmin;
    const deslogar = props?.deslogar;
    const tokenIntegracaoFrequencia = props?.tokenIntegracaoFrequencia;

    const endpoint = () => {
      if (acessoAdmin)
        return api.put(`v1/autenticacao/suporte/${login.usuario}`);

      if (deslogar) return api.put(`v1/autenticacao/suporte/deslogar`);

      if (tokenIntegracaoFrequencia)
        return api.post(
          `/v1/autenticacao/integracoes/frequencia/${tokenIntegracaoFrequencia}`
        );

      return api.post('v1/autenticacao', {
        login: login.usuario,
        senha: login.senha,
      });
    };

    const validarAutenticar = (limparDadosSuporte = false) =>
      endpoint()
        .then(res => {
          let dados = null;

          if (tokenIntegracaoFrequencia) {
            dados = res.data.usuarioAutenticacao;
          } else {
            dados = res.data;
          }

          const token = dados?.token;
          store.dispatch(salvarToken(token));

          if (limparDadosSuporte || tokenIntegracaoFrequencia) {
            localStorage.clear();
            store.dispatch(limparDadosFiltro());
            store.dispatch(Deslogar());
            store.dispatch(removerTurma());
            store.dispatch(setLimparTurmaFiltroAutenticacaoFrequencia());
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

          if (tokenIntegracaoFrequencia) {
            const turmaFrequencia = {
              turma: res.data?.turma,
              componenteCurricularCodigo: res.data?.componenteCurricularCodigo,
            };
            store.dispatch(
              setDadosFiltroAutenticacaoFrequencia(turmaFrequencia)
            );

            setTimeout(() => {
              store.dispatch(setLimparTurmaFiltroAutenticacaoFrequencia());
            }, 15000);
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
}

export default new LoginService();
