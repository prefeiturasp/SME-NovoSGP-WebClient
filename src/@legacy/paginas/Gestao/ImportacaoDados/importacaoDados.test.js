import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ImportacaoDados from './ImportacaoDados';
import { BrowserRouter } from 'react-router-dom';
import api from '~/servicos/api';

jest.mock('~/servicos/api');

jest.mock('~/componentes-sgp', () => ({
  Cabecalho: ({ children }) => <div data-testid="cabecalho">{children}</div>,
}));

jest.mock(
  '~/componentes-sgp/BotoesAcaoPadrao/botaoVoltarPadrao',
  () => props =>
    (
      <button data-testid="botao-voltar" onClick={props.onClick}>
        Voltar
      </button>
    )
);

jest.mock('~/componentes', () => ({
  Button: props => <button onClick={props.onClick}>{props.label}</button>,
  ListaPaginada: props => <div data-testid="lista-paginada">{props.url}</div>,
  Colors: {
    Roxo: 'purple',
    CinzaBotao: 'gray',
    CinzaBordaCalendario: '#cccccc',
  },
  Base: {
    CinzaBordaCalendario: '#cccccc',
  },
}));

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  useParams: () => ({}),
}));

describe('ImportacaoDados', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve renderizar cabeçalho e lista paginada', () => {
    render(
      <BrowserRouter>
        <ImportacaoDados />
      </BrowserRouter>
    );

    expect(screen.getByTestId('cabecalho')).toBeInTheDocument();
    expect(
      screen.getByText('Lista de importações por arquivo')
    ).toBeInTheDocument();
    expect(screen.getByTestId('lista-paginada')).toHaveTextContent(
      'v1/importar-arquivo'
    );
  });

  it('deve chamar navigate ao clicar no botão voltar', () => {
    render(
      <BrowserRouter>
        <ImportacaoDados />
      </BrowserRouter>
    );

    fireEvent.click(screen.getByTestId('botao-voltar'));
    expect(mockNavigate).toHaveBeenCalled();
  });

  it('deve atualizar a lista ao clicar em "Atualizar Dados"', () => {
    render(
      <BrowserRouter>
        <ImportacaoDados />
      </BrowserRouter>
    );

    fireEvent.click(screen.getByText('Atualizar Dados'));
    expect(screen.getByTestId('lista-paginada')).toBeInTheDocument();
  });
});
