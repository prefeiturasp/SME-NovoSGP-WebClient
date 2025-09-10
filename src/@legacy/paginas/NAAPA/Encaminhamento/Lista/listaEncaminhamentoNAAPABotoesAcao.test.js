import { render, screen, fireEvent } from '@testing-library/react';
import ListaEncaminhamentoNAAPABotoesAcao from './ListaEncaminhamentoNAAPABotoesAcao';
import { ROUTES } from '@/core/enum/routes';
import { URL_HOME } from '~/constantes';

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

jest.mock('~/componentes', () => ({
  Button: ({ label, onClick, disabled, id }) => (
    <button onClick={onClick} disabled={disabled} data-testid={id}>
      {label}
    </button>
  ),
  Colors: { Roxo: 'roxo' },
}));

jest.mock('~/componentes-sgp/BotoesAcaoPadrao/botaoVoltarPadrao', () => ({
  __esModule: true,
  default: ({ onClick }) => (
    <button onClick={onClick} data-testid="btn-voltar">
      Voltar
    </button>
  ),
}));

jest.mock('../componentes/btnImpressaoNAAPA', () => ({
  __esModule: true,
  default: ({ idsSelecionados }) => (
    <div data-testid="btn-impressao">{JSON.stringify(idsSelecionados)}</div>
  ),
}));

describe('ListaEncaminhamentoNAAPABotoesAcao', () => {
  const defaultProps = {
    somenteConsulta: false,
    podeIncluir: true,
    idsSelecionados: [1, 2],
    obterDadosFiltros: jest.fn(() => ({ filtro: 'teste' })),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve renderizar os botões corretamente', () => {
    render(<ListaEncaminhamentoNAAPABotoesAcao {...defaultProps} />);

    expect(screen.getByTestId('btn-voltar')).toBeInTheDocument();
    expect(screen.getByTestId('btn-impressao')).toHaveTextContent(
      JSON.stringify([1, 2])
    );
    expect(screen.getByTestId('SGP_BUTTON_NOVO')).toHaveTextContent('Novo');
  });

  it('deve chamar navigate para URL_HOME ao clicar no botão Voltar', () => {
    render(<ListaEncaminhamentoNAAPABotoesAcao {...defaultProps} />);

    fireEvent.click(screen.getByTestId('btn-voltar'));

    expect(mockNavigate).toHaveBeenCalledWith(URL_HOME);
  });

  it('deve chamar navigate com state ao clicar no botão Novo', () => {
    render(<ListaEncaminhamentoNAAPABotoesAcao {...defaultProps} />);

    fireEvent.click(screen.getByTestId('SGP_BUTTON_NOVO'));

    expect(defaultProps.obterDadosFiltros).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith(
      `${ROUTES.ENCAMINHAMENTO_NAAPA}/novo`,
      { state: { filtro: 'teste' } }
    );
  });

  it('deve desabilitar o botão Novo quando somenteConsulta for true', () => {
    render(
      <ListaEncaminhamentoNAAPABotoesAcao
        {...defaultProps}
        somenteConsulta={true}
      />
    );

    expect(screen.getByTestId('SGP_BUTTON_NOVO')).toBeDisabled();
  });

  it('deve desabilitar o botão Novo quando podeIncluir for false', () => {
    render(
      <ListaEncaminhamentoNAAPABotoesAcao
        {...defaultProps}
        podeIncluir={false}
      />
    );

    expect(screen.getByTestId('SGP_BUTTON_NOVO')).toBeDisabled();
  });
});
