import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import SiderSGP from '.';

jest.mock('../../lib/sider', () => ({
  __esModule: true,
  default: () => <div>SiderSME Mockado</div>,
  getItemMenu: jest.fn(() => ({})),
}));

jest.mock('@/@legacy/servicos', () => ({
  obterDescricaoNomeMenu: jest.fn(() => 'Menu Mockado'),
}));

const mockStore = configureStore([]);

describe('SiderSGP', () => {
  it('não renderiza se menu não estiver visivel', () => {
    const store = mockStore({
      usuario: { menu: [] },
      navegacao: { rotaAtiva: '', rotas: new Map(), menuSelecionado: [] },
      filtro: { modalidades: [] },
    });

    const { container } = render(
      <Provider store={store}>
        <BrowserRouter>
          <SiderSGP />
        </BrowserRouter>
      </Provider>,
    );

    expect(container).toBeEmptyDOMElement();
  });
});
