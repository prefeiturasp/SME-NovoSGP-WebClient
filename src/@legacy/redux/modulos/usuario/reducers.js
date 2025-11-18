import produce from 'immer';

const inicial = {
  rf: '',
  token: '',
  acessoAdmin: undefined,
  administradorSuporte: {},
  usuario: '',
  dataLogin: null,
  logado: false,
  turmasUsuario: [],
  turmaSelecionada: {},
  filtroAtual: {},
  dadosUsuario: [],
  modificarSenha: '',
  meusDados: {
    foto: '',
  },
  possuiPerfilSmeOuDre: false,
  possuiPerfilDre: false,
  possuiPerfilSme: false,
  ehProfessorCj: false,
  ehProfessor: false,
  ehProfessorPoa: false,
  menu: [],
  permissoes: [],
  sessaoExpirou: false,
  ehProfessorCjInfantil: false,
  ehProfessorInfantil: false,
  ehPerfilProfessor: false,
  recarregarFiltroPrincipal: false,
  listaUrlAjudaDoSistema: [],
};

export default function usuario(state = inicial, action) {
  return produce(state, draft => {
    switch (action.type) {
      case '@usuario/salvarRf':
        draft.rf = action.payload;
        window.clarity('identify', action.payload);
        break;
      case '@usuario/turmasUsuario':
        draft.turmasUsuario = action.payload;
        break;
      case '@usuario/salvarLogin':
        window.clarity('identify', action.payload.rf.trim() || draft.rf);
        draft.rf = action.payload.rf.trim() || draft.rf;
        draft.token = action.payload.token;
        draft.dataLogin = new Date();
        draft.logado = true;
        draft.usuario = action.payload.usuario;
        draft.modificarSenha = action.payload.modificarSenha;
        draft.possuiPerfilSmeOuDre = action.payload.possuiPerfilSmeOuDre;
        draft.possuiPerfilDre = action.payload.possuiPerfilDre;
        draft.possuiPerfilSme = action.payload.possuiPerfilSme;
        draft.ehProfessorCj = action.payload.ehProfessorCj;
        draft.ehProfessor = action.payload.ehProfessor;
        draft.menu = action.payload.menu;
        draft.ehProfessorPoa = action.payload.ehProfessorPoa;
        draft.dataHoraExpiracao = action.payload.dataHoraExpiracao;
        draft.sessaoExpirou = false;
        draft.ehProfessorInfantil = action.payload.ehProfessorInfantil;
        draft.ehProfessorCjInfantil = action.payload.ehProfessorCjInfantil;
        draft.ehPerfilProfessor = action.payload.ehPerfilProfessor;
        break;
      case '@usuario/salvarLoginRevalidado':
        draft.token = action.payload.token;
        draft.dataLogin = new Date();
        draft.dataHoraExpiracao = action.payload.dataHoraExpiracao;
        break;
      case '@usuario/salvarToken':
        draft.token = action.payload;
        break;
      case '@usuario/deslogar':
        localStorage.clear();
        draft = inicial;
        break;
      case '@usuario/deslogarSessaoExpirou':
        localStorage.clear();
        draft = inicial;
        draft.sessaoExpirou = true;
        break;
      case '@usuario/selecionarTurma':
        draft.turmaSelecionada = action.payload;
        break;
      case '@usuario/removerTurma':
        draft.turmaSelecionada = [];
        break;
      case '@usuario/meusDados':
        draft.meusDados = action.payload;
        break;
      case '@usuario/setarConsideraHistorico':
        draft.turmaSelecionada = {
          ...state.turmaSelecionada,
          consideraHistorico: action.payload,
        };
        break;
      case '@usuario/meusDadosSalvarEmail':
        draft.meusDados.email = action.payload;
        break;
      case '@usuario/filtroAtual':
        draft.filtroAtual = action.payload;
        break;
      case '@usuario/salvarDadosUsuario':
        draft.dadosUsuario = action.payload;
        break;
      case '@usuario/setMenu':
        draft.menu = action.payload;
        break;
      case '@usuario/setPermissoes':
        draft.permissoes = action.payload;
        break;
      case '@usuario/setModificarSenha':
        draft.modificarSenha = action.payload;
        break;
      case '@usuario/setLogado':
        draft.logado = action.payload;
        break;
      case '@usuario/setRecarregarFiltroPrincipal':
        draft.recarregarFiltroPrincipal = action.payload;
        break;
      case '@usuario/setLoginAcessoAdmin':
        draft.acessoAdmin = action.payload.acessoAdmin;
        draft.administradorSuporte = action.payload.administradorSuporte;
        break;
      case '@usuario/setListaUrlAjudaDoSistema':
        draft.listaUrlAjudaDoSistema = action.payload;
        break;
      default:
        break;
    }
  });
}
