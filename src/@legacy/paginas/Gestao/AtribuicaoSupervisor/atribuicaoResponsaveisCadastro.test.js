import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import AtribuicaoResponsaveisCadastro from './atribuicaoResponsaveisCadastro';
import ServicoResponsaveis from '~/servicos/Paginas/Gestao/Responsaveis/ServicoResponsaveis';
import { AbrangenciaServico, erro, erros, sucesso } from '~/servicos';

const mockNavigate = jest.fn();
const mockParamsRoute = {};

jest.mock('@/core/enum/routes', () => ({
  ROUTES: {
    ATRIBUICAO_RESPONSAVEIS: '/gestao/atribuicao-responsaveis',
    ATRIBUICAO_RESPONSAVEIS_LISTA: '/gestao/atribuicao-responsaveis/lista',
  },
}));

jest.mock('@/core/redux', () => ({
  store: {
    getState: () => ({
      usuario: {
        permissoes: {
          '/gestao/atribuicao-responsaveis/lista': {
            podeConsultar: true,
            podeIncluir: true,
            podeAlterar: true,
          },
        },
      },
    }),
  },
}));

jest.mock('react-router-dom', () => ({
  useLocation: () => ({ pathname: '/gestao/atribuicao-responsaveis' }),
  useNavigate: () => mockNavigate,
  useParams: () => mockParamsRoute,
}));

jest.mock('antd', () => ({
  Col: ({ children }) => <div>{children}</div>,
  Row: ({ children }) => <div>{children}</div>,
}));

jest.mock('~/componentes', () => ({
  Button: ({ disabled, id, label, onClick }) => (
    <button disabled={disabled} id={id} onClick={onClick} type="button">
      {label}
    </button>
  ),
  Card: ({ children }) => <div>{children}</div>,
  Colors: { Azul: 'azul', Roxo: 'roxo' },
  Loader: ({ children, loading, tip }) => (
    <div>
      <span data-testid="estado-loader">{loading ? tip : ''}</span>
      {children}
    </div>
  ),
  SelectComponent: () => <div />,
}));

jest.mock('~/componentes-sgp', () => ({
  Cabecalho: ({ children }) => <div>{children}</div>,
}));

jest.mock(
  '~/componentes-sgp/BotoesAcaoPadrao/botaoVoltarPadrao',
  () =>
    ({ onClick }) =>
      (
        <button onClick={onClick} type="button">
          Voltar
        </button>
      )
);

jest.mock('~/componentes/auditoria', () => () => <div />);
jest.mock('./listaTransferenciaResponsaveis', () => () => <div />);

jest.mock('~/servicos', () => ({
  AbrangenciaServico: { buscarDres: jest.fn() },
  confirmar: jest.fn(),
  erro: jest.fn(),
  erros: jest.fn(),
  setBreadcrumbManual: jest.fn(),
  sucesso: jest.fn(),
  verificaSomenteConsulta: jest.fn(),
}));

jest.mock('~/servicos/Paginas/Gestao/Responsaveis/ServicoResponsaveis', () => ({
  obterTipoReponsavel: jest.fn(),
  obterResponsaveis: jest.fn(),
  obterUesSemAtribuicao: jest.fn(),
  obterUesAtribuidas: jest.fn(),
  salvarAtribuicao: jest.fn(),
}));

const criarPromiseControlada = () => {
  let resolver;
  let rejeitar;
  const promise = new Promise((resolve, reject) => {
    resolver = resolve;
    rejeitar = reject;
  });
  return { promise, rejeitar, resolver };
};

describe('AtribuicaoResponsaveisCadastro', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    AbrangenciaServico.buscarDres.mockResolvedValue({ data: [] });
    ServicoResponsaveis.obterTipoReponsavel.mockResolvedValue({ data: [] });
    ServicoResponsaveis.obterResponsaveis.mockResolvedValue({ data: [] });
    ServicoResponsaveis.obterUesSemAtribuicao.mockResolvedValue({ data: [] });
    ServicoResponsaveis.obterUesAtribuidas.mockResolvedValue({ data: [] });
  });

  it('exibe o processamento e impede múltiplos salvamentos', async () => {
    const requisicao = criarPromiseControlada();
    ServicoResponsaveis.salvarAtribuicao.mockReturnValue(requisicao.promise);

    render(<AtribuicaoResponsaveisCadastro />);

    const salvar = screen.getByRole('button', { name: 'Salvar' });
    fireEvent.click(salvar);
    fireEvent.click(salvar);

    expect(ServicoResponsaveis.salvarAtribuicao).toHaveBeenCalledTimes(1);
    expect(
      screen.getByText(
        'Salvando a atribuição e atualizando os Planos AEE. Aguarde...'
      )
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Salvando...' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Cancelar' })).toBeDisabled();

    await act(async () => requisicao.resolver({}));

    await waitFor(() => expect(sucesso).toHaveBeenCalledTimes(1));
    expect(mockNavigate).toHaveBeenCalledWith(
      '/gestao/atribuicao-responsaveis/lista'
    );
  });

  it('libera uma nova tentativa e preserva o tratamento de erro', async () => {
    const requisicao = criarPromiseControlada();
    ServicoResponsaveis.salvarAtribuicao.mockReturnValue(requisicao.promise);

    render(<AtribuicaoResponsaveisCadastro />);
    fireEvent.click(screen.getByRole('button', { name: 'Salvar' }));

    await act(async () => requisicao.rejeitar(new Error('Falha de rede')));

    await waitFor(() => expect(erros).toHaveBeenCalledTimes(1));
    expect(screen.getByRole('button', { name: 'Salvar' })).toBeEnabled();
    expect(
      screen.queryByText(
        'Salvando a atribuição e atualizando os Planos AEE. Aguarde...'
      )
    ).not.toBeInTheDocument();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('apresenta as mensagens de erro de negócio retornadas pela API', async () => {
    ServicoResponsaveis.salvarAtribuicao.mockRejectedValue({
      response: {
        status: 601,
        data: { mensagens: ['Não foi possível atualizar o Plano AEE.'] },
      },
    });

    render(<AtribuicaoResponsaveisCadastro />);
    fireEvent.click(screen.getByRole('button', { name: 'Salvar' }));

    await waitFor(() =>
      expect(erro).toHaveBeenCalledWith(
        'Não foi possível atualizar o Plano AEE.'
      )
    );
    expect(screen.getByRole('button', { name: 'Salvar' })).toBeEnabled();
  });
});
