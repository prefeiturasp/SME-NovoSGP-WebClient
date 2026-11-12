import { act, render, screen } from '@testing-library/react';

import TempoExpiracaoSessao from './tempoExpiracaoSessao';

const mockUseSelector = jest.fn();
const mockUseNavigate = jest.fn();

jest.mock('react-redux', () => ({
  useSelector: selector => mockUseSelector(selector),
}));

jest.mock('react-router-dom', () => ({
  useNavigate: () => mockUseNavigate(),
}));

jest.mock('~/servicos/variaveis', () => ({
  tempoAvisoExpiracaoSessaoMinutos: 700,
}));

jest.mock('./contadorExpiracao', () => {
  const MockContadorExpiracao = () => <span>contador</span>;
  return MockContadorExpiracao;
});

jest.mock('~/componentes/button', () => {
  const MockButton = props => (
    <button
      type="button"
      {...Object.fromEntries(
        Object.entries(props).filter(([nome]) => nome !== 'border')
      )}
    />
  );
  return MockButton;
});

jest.mock('@/core/redux', () => ({
  store: { dispatch: jest.fn() },
}));

jest.mock('~/redux/modulos/filtro/actions', () => ({
  limparDadosFiltro: jest.fn(),
}));

jest.mock('~/redux/modulos/sessao/actions', () => ({
  LimparSessao: jest.fn(),
}));

jest.mock('~/redux/modulos/usuario/actions', () => ({
  DeslogarSessaoExpirou: jest.fn(),
  salvarLoginRevalidado: jest.fn(),
}));

jest.mock('~/servicos/alertas', () => ({
  erros: jest.fn(),
}));

jest.mock('~/servicos/api', () => ({
  post: jest.fn(),
}));

describe('TempoExpiracaoSessao', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-11-12T12:00:00Z'));
    mockUseNavigate.mockReturnValue(jest.fn());
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  it('exibe a mensagem em minutos quando nao ha horas', () => {
    mockUseSelector.mockImplementation(selector =>
      selector({ usuario: { dataHoraExpiracao: '2026-11-12T12:12:00Z' } })
    );

    render(<TempoExpiracaoSessao />);

    act(() => {
      jest.advanceTimersByTime(1);
    });

    expect(
      screen.getByText(/Sua sessão irá expirar em 12 minutos/)
    ).toBeInTheDocument();
  });

  it('exibe a mensagem em horas e minutos quando ha horas', () => {
    mockUseSelector.mockImplementation(selector =>
      selector({ usuario: { dataHoraExpiracao: '2026-11-12T15:26:00Z' } })
    );

    render(<TempoExpiracaoSessao />);

    act(() => {
      jest.advanceTimersByTime(1);
    });

    expect(
      screen.getByText(/Sua sessão irá expirar em 3 horas e 26 minutos/)
    ).toBeInTheDocument();
  });
});
