import produce from 'immer';

const MENU_OCULTO_KEY = 'sgp-menu-oculto';

const rotas = new Map();
const inicial = {
  retraido: false,
  rotaAtiva: '/',
  rotas,
  menuSelecionado: [],
  somenteConsulta: false,
  mensagemSomenteConsulta: null,
  menuOculto: localStorage.getItem(MENU_OCULTO_KEY) === 'true',
};

export default function navegacao(state = inicial, action) {
  return produce(state, draft => {
    switch (action.type) {
      case '@navegacao/retraido':
        draft.retraido = action.payload;
        break;
      case '@navegacao/rotaAtiva':
        draft.rotaAtiva = action.payload;
        break;
      case '@navegacao/rotas':
        draft.rotas.set(action.payload.path, action.payload);
        break;
      case '@navegacao/menuSelecionado':
        draft.menuSelecionado = action.payload;
        break;
      case '@navegacao/somenteConsulta':
        draft.somenteConsulta = action.payload;
        break;
      case '@navegacao/mensagemSomenteConsulta':
        draft.mensagemSomenteConsulta = action.payload;
        break;
      case '@navegacao/menuOculto':
        draft.menuOculto = action.payload;
        localStorage.setItem(
          MENU_OCULTO_KEY,
          action.payload ? 'true' : 'false'
        );
        break;
      default:
        break;
    }
  });
}
