import { render, cleanup } from '@testing-library/react';
import RelatorioPAP from './relatorioPAP';
import { useDispatch, useSelector } from 'react-redux';

jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));
jest.mock('~/componentes', () => ({
  Card: ({ children }) => <div data-testid="card">{children}</div>,
}));
jest.mock('~/componentes-sgp', () => ({
  AlertaModalidadeInfantil: () => <div>AlertaModalidadeInfantil</div>,
  Cabecalho: ({ children }) => <div>Cabecalho{children}</div>,
}));
jest.mock('./componentes/alertaDentroPeriodoPAP', () => () => (
  <div>AlertaDentroPeriodoPAP</div>
));
jest.mock('./componentes/alertaSemTurmaPAP', () => () => (
  <div>AlertaSemTurmaPAP</div>
));
jest.mock('./componentes/alertaSemTurmaSelecionada', () => () => (
  <div>AlertaSemTurmaSelecionada</div>
));
jest.mock('./componentes/botoesAcoes', () => () => (
  <div>BotoesAcoesRelatorioPAP</div>
));
jest.mock('./componentes/dadosRelatorioPAP', () => () => (
  <div>DadosRelatorioPAP</div>
));
jest.mock('./componentes/loader', () => ({ children }) => (
  <div>LoaderRelatorioPAP{children}</div>
));
jest.mock('./componentes/selectPeriodo', () => () => (
  <div>SelectPeridosPAP</div>
));

const mockDispatch = jest.fn();

describe('RelatorioPAP', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useDispatch.mockReturnValue(mockDispatch);
  });

  afterEach(cleanup);

  it('renderiza todos os subcomponentes e conteúdo condicional', () => {
    useSelector.mockImplementation(cb =>
      cb({ usuario: { turmaSelecionada: { turma: 'turma 1' } } })
    );
    const { getByText, getByTestId } = render(<RelatorioPAP />);
    expect(getByText('AlertaSemTurmaSelecionada')).toBeInTheDocument();
    expect(getByText('AlertaSemTurmaPAP')).toBeInTheDocument();
    expect(getByText('AlertaModalidadeInfantil')).toBeInTheDocument();
    expect(getByText('AlertaDentroPeriodoPAP')).toBeInTheDocument();
    expect(getByText('Cabecalho')).toBeInTheDocument();
    expect(getByText('BotoesAcoesRelatorioPAP')).toBeInTheDocument();
    expect(getByTestId('card')).toBeInTheDocument();
    expect(getByText('SelectPeridosPAP')).toBeInTheDocument();
    expect(getByText('DadosRelatorioPAP')).toBeInTheDocument();
    expect(getByText('LoaderRelatorioPAP')).toBeInTheDocument();
  });

  it('não renderiza SelectPeridosPAP e DadosRelatorioPAP se turmaSelecionada.turma não existe', () => {
    useSelector.mockImplementation(cb =>
      cb({ usuario: { turmaSelecionada: {} } })
    );
    const { queryByText } = render(<RelatorioPAP />);
    expect(queryByText('SelectPeridosPAP')).toBeNull();
    expect(queryByText('DadosRelatorioPAP')).toBeNull();
  });

  it('faz os dispatches de limpeza no unmount', () => {
    useSelector.mockImplementation(cb =>
      cb({ usuario: { turmaSelecionada: { turma: 'turma 1' } } })
    );
    const { unmount } = render(<RelatorioPAP />);
    unmount();
    // Espera 4 dispatches de limpeza
    expect(mockDispatch).toHaveBeenCalledTimes(4);
  });
});
