import { render, screen } from '@testing-library/react';
import { AlertaSemTurmaSelecionada } from './index';
import { useAppSelector } from '@/core/hooks/use-redux';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';

jest.mock('@/core/hooks/use-redux');

const mockUseAppSelector = useAppSelector as jest.Mock;

describe('AlertaSemTurmaSelecionada', () => {
  const mockStore = configureStore([]);
  const store = mockStore({});
  afterEach(() => {
    mockUseAppSelector.mockReset();
    store.clearActions();
  });

  it('não renderiza quando há turma selecionada', () => {
    mockUseAppSelector.mockReturnValue({ turmaSelecionada: { turma: { id: 1 } } });
    const { container } = render(
      <Provider store={store}>
        <AlertaSemTurmaSelecionada />
      </Provider>,
    );
    expect(container.firstChild).toBeNull();
  });

  it('exibe alerta de warning quando não há turma', () => {
    mockUseAppSelector.mockReturnValue({ turmaSelecionada: { turma: null } });
    render(
      <Provider store={store}>
        <AlertaSemTurmaSelecionada />
      </Provider>,
    );
    const alertEl = screen.getByRole('alert');
    expect(alertEl).toHaveClass('alert-warning');
    expect(alertEl).toHaveTextContent('Você precisa escolher uma turma.');
  });

  it('exibe alerta quando usuário indefinido', () => {
    mockUseAppSelector.mockReturnValue(undefined);
    render(
      <Provider store={store}>
        <AlertaSemTurmaSelecionada />
      </Provider>,
    );
    const alertEl = screen.getByRole('alert');
    expect(alertEl).toHaveClass('alert-warning');
    expect(alertEl).toHaveTextContent('Você precisa escolher uma turma.');
  });

  it('exibe alerta quando usuario existe mas não tem turmaSelecionada', () => {
    mockUseAppSelector.mockReturnValue({});
    render(
      <Provider store={store}>
        <AlertaSemTurmaSelecionada />
      </Provider>,
    );
    const alertEl = screen.getByRole('alert');
    expect(alertEl).toHaveClass('alert-warning');
    expect(alertEl).toHaveTextContent('Você precisa escolher uma turma.');
  });

  it('exibe alerta quando usuario existe mas turmaSelecionada é undefined', () => {
    mockUseAppSelector.mockReturnValue({ turmaSelecionada: undefined });
    render(
      <Provider store={store}>
        <AlertaSemTurmaSelecionada />
      </Provider>,
    );
    const alertEl = screen.getByRole('alert');
    expect(alertEl).toHaveClass('alert-warning');
    expect(alertEl).toHaveTextContent('Você precisa escolher uma turma.');
  });

  it('não renderiza quando turmaSelecionada.turma está vazio', () => {
    mockUseAppSelector.mockReturnValue({ turmaSelecionada: { turma: {} } });
    const { container } = render(
      <Provider store={store}>
        <AlertaSemTurmaSelecionada />
      </Provider>,
    );
    expect(container.firstChild).toBeNull();
  });
});
