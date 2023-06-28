import { ROUTES } from '@/core/enum/routes';
import { URL_HOME, URL_REDEFINIRSENHA } from '~/constantes/url';
import {
  salvarDadosLogin,
  setLoginAcessoAdmin,
} from '~/redux/modulos/usuario/actions';
import { erros } from '~/servicos';
import ServicoDashboard from '~/servicos/Paginas/Dashboard/ServicoDashboard';
import LoginService from '~/servicos/Paginas/LoginServices';
import ServicoNotificacao from '~/servicos/Paginas/ServicoNotificacao';
import {
  buscarVersao,
  obterMeusDados,
} from '~/servicos/Paginas/ServicoUsuario';
import { setMenusPermissoes } from '~/servicos/servico-navegacao';

class LoginHelper {
  constructor(dispatch, redirect) {
    this.dispatch = dispatch;
    this.redirect = redirect;
  }

  acessar = async props => {
    const login = props?.login;
    const acessoAdmin = props?.acessoAdmin;
    const deslogar = props?.deslogar;
    const navigate = props?.navigate;
    const tokenIntegracaoFrequencia = props?.tokenIntegracaoFrequencia;

    const autenticacao = await LoginService.autenticar({
      login,
      acessoAdmin,
      deslogar,
      tokenIntegracaoFrequencia,
    });

    if (!autenticacao.sucesso) return autenticacao;

    const rf =
      login?.usuario || login?.login || autenticacao?.dados?.usuarioLogin;

    this.dispatch(
      setLoginAcessoAdmin({
        acessoAdmin,
        administradorSuporte: autenticacao.dados.administradorSuporte,
      })
    );
    this.dispatch(
      salvarDadosLogin({
        token: autenticacao.dados.token,
        rf,
        usuario: login?.UsuarioLogin || autenticacao?.dados?.usuarioLogin,
        modificarSenha: autenticacao.dados.modificarSenha,
        perfisUsuario: autenticacao.dados.perfisUsuario,
        possuiPerfilSmeOuDre:
          autenticacao.dados.perfisUsuario.possuiPerfilSmeOuDre,
        possuiPerfilDre: autenticacao.dados.perfisUsuario.possuiPerfilDre,
        possuiPerfilSme: autenticacao.dados.perfisUsuario.possuiPerfilSme,
        ehProfessor: autenticacao.dados.perfisUsuario.ehProfessor,
        ehProfessorCj: autenticacao.dados.perfisUsuario.ehProfessorCj,
        ehProfessorInfantil:
          autenticacao.dados.perfisUsuario.ehProfessorInfantil,
        ehProfessorCjInfantil:
          autenticacao.dados.perfisUsuario.ehProfessorCjInfantil,
        ehPerfilProfessor: autenticacao.dados.perfisUsuario.ehPerfilProfessor,
        ehProfessorPoa: autenticacao.dados.perfisUsuario.ehProfessorPoa,
        dataHoraExpiracao: autenticacao.dados.dataHoraExpiracao,
      })
    );

    ServicoDashboard.obterDadosDashboard();

    if (autenticacao.dados.modificarSenha) {
      navigate(URL_REDEFINIRSENHA, { state: rf });
      return { sucesso: false, erroGeral: '' };
    }
    obterMeusDados();
    buscarVersao();

    setMenusPermissoes().then(() => {
      if (tokenIntegracaoFrequencia) {
        navigate(ROUTES.FREQUENCIA_PLANO_AULA);
      }
    });

    if (acessoAdmin) {
      ServicoNotificacao.obterUltimasNotificacoesNaoLidas().catch(e =>
        erros(e)
      );
      ServicoNotificacao.obterQuantidadeNotificacoesNaoLidas().catch(e =>
        erros(e)
      );
    }

    if (this.redirect) navigate(atob(this.redirect));
    else navigate(URL_HOME);

    return autenticacao;
  };
}

export default LoginHelper;
