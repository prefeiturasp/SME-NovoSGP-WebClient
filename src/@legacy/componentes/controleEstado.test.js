import { render } from '@testing-library/react';
import { ControleEstado } from './controleEstado';

jest.mock('react-router-dom', () => ({
  Prompt: jest.fn(() => <div data-testid="prompt" />),
}));

const mockConfirmacao = jest.fn();
jest.mock('../servicos/alertas', () => ({
  confirmacao: (...args) => mockConfirmacao(...args),
}));

describe('ControleEstado', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renderiza Prompt quando when=true', () => {
    const { getByTestId } = render(
      <ControleEstado when={true} cancelar={jest.fn()} confirmar={jest.fn()} />
    );
    expect(getByTestId('prompt')).toBeInTheDocument();
  });

  it('chama confirmacao ao tentar navegar sem confirmar', () => {
    const cancelar = jest.fn();
    const confirmar = jest.fn();
    const wrapper = new ControleEstado({ when: true, cancelar, confirmar });
    wrapper.setState = jest.fn((state, cb) => cb && cb());
    wrapper.state = { confirmou: false };
    const nextLocation = { pathname: '/outra' };
    wrapper.bloquearNavegacao(nextLocation);
    expect(mockConfirmacao).toHaveBeenCalled();
    const confirmCallback = mockConfirmacao.mock.calls[0][2];
    confirmCallback();
    expect(confirmar).toHaveBeenCalledWith('/outra');
  });

  it('não chama confirmacao se já confirmou', () => {
    const cancelar = jest.fn();
    const confirmar = jest.fn();
    const wrapper = new ControleEstado({ when: true, cancelar, confirmar });
    wrapper.state = { confirmou: true };
    const nextLocation = { pathname: '/outra' };
    const result = wrapper.bloquearNavegacao(nextLocation);
    expect(mockConfirmacao).not.toHaveBeenCalled();
    expect(result).toBeUndefined();
  });
});
