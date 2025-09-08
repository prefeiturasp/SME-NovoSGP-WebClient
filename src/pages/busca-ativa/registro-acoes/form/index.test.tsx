import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { BrowserRouter } from 'react-router-dom';
import BuscaAtivaRegistroAcoesForm from './index';

jest.mock('@/components/lib/header-page', () => ({ title }: { title: string }) => <h1>{title}</h1>);

const mockStore = configureStore([]);
const defaultStore = mockStore({
  usuario: { permissoes: {} },
  buscaAtivaRegistroAcoes: { desabilitarCamposBuscaAtivaRegistroAcoes: false },
});

describe('BuscaAtivaRegistroAcoesForm', () => {
  it('deve mostrar estrutura basica do form', () => {
    render(
      <Provider store={defaultStore}>
        <BrowserRouter>
          <BuscaAtivaRegistroAcoesForm />
        </BrowserRouter>
      </Provider>,
    );

    expect(screen.getByRole('heading', { name: 'Registro de ações' })).toBeInTheDocument();
  });
});
