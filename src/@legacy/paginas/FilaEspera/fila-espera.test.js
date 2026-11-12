import { fireEvent, render, screen } from '@testing-library/react';
import FilaEspera, { calcularTempoEstimadoEspera } from './fila-espera';

const mockNavigate = jest.fn();
const mockUseSelector = jest.fn();

jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

jest.mock('react-redux', () => ({
  useSelector: selector => mockUseSelector(selector),
}));

describe('FilaEspera', () => {
  beforeEach(() => {
    mockUseSelector.mockImplementation(selector =>
      selector({ usuarioFilaEspera: { numeroFila: 0 } })
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it.each([
    [1, 5],
    [500, 5],
    [501, 10],
    [1000, 10],
    [1001, 15],
    [1500, 15],
    [1501, 20],
  ])('calcula o tempo estimado para a posição %i', (posicao, minutos) => {
    expect(calcularTempoEstimadoEspera(posicao)).toBe(minutos);
  });

  it('exibe as informações de redirecionamento', () => {
    render(<FilaEspera />);

    expect(screen.getByText(/Logo você será/)).toBeInTheDocument();
    expect(
      screen.getByText(
        /O tempo estimado de espera é de aproximadamente 5 minutos/
      )
    ).toBeInTheDocument();
    expect(screen.getByText(/Não atualize a página!/)).toBeInTheDocument();
    expect(
      screen.getByText(/Isso pode aumentar o seu tempo de espera/)
    ).toBeInTheDocument();
  });

  it('navega para login da sondagem ao clicar no link', () => {
    render(<FilaEspera />);

    fireEvent.click(screen.getByText('clique aqui'));

    expect(mockNavigate).toHaveBeenCalledWith('/login-sondagem');
  });
});
