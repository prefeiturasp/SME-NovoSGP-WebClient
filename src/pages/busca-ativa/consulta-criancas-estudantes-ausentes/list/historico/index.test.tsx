import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import BuscaAtivaHistoricoRegistroAcoes from './index';
import { useLocation } from 'react-router-dom';
import { Provider } from 'react-redux';

jest.mock('./list', () => () => <div data-testid="historico-list" />);
jest.mock('./components/modal-atualizar-dados', () => (props: any) => (
  <div data-testid="modal-atualizar-dados" {...props} />
));
jest.mock('@/components/lib/header-page', () => (props: any) => (
  <div data-testid="header-page">{props.children}</div>
));
jest.mock('@/components/lib/card-content', () => (props: any) => (
  <div data-testid="card-content">{props.children}</div>
));
jest.mock('@/components/sgp/card-detalhes-crianca-estudante', () => (props: any) => (
  <div data-testid="card-detalhes" {...props} />
));
jest.mock('~/componentes-sgp/BotoesAcaoPadrao/botaoVoltarPadrao', () => (props: any) => (
  <button data-testid="botao-voltar" onClick={props.onClick}>
    Voltar
  </button>
));
jest.mock('@/components/lib/button/primary', () => (props: any) => (
  <button data-testid="botao-novo" disabled={props.disabled} onClick={props.onClick}>
    {props.children}
  </button>
));

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  useLocation: jest.fn(),
}));

const mockState = {
  usuario: {
    permissoes: {
      '/busca-ativa/consulta-criancas-estudantes-ausentes': { podeIncluir: true },
      '/busca-ativa/criancas-estudantes/ausentes': { podeIncluir: true },
    },
  },
};

const mockStore = {
  getState: () => mockState,
  subscribe: jest.fn(),
  dispatch: jest.fn(),
};

const defaultLocationState = {
  anoLetivo: 2024,
  aluno: { codigoAluno: 'A1' },
  turmaCodigo: 'T1',
};

describe('BuscaAtivaHistoricoRegistroAcoes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useLocation as jest.Mock).mockReturnValue({ state: defaultLocationState });
  });

  const renderWithProvider = (ui: React.ReactElement) =>
    render(<Provider store={mockStore as any}>{ui}</Provider>);

  it('renderiza componentes principais', () => {
    renderWithProvider(<BuscaAtivaHistoricoRegistroAcoes />);
    expect(screen.getByTestId('header-page')).toBeInTheDocument();
    expect(screen.getByTestId('card-content')).toBeInTheDocument();
    expect(screen.getByTestId('card-detalhes')).toBeInTheDocument();
    expect(screen.getByTestId('historico-list')).toBeInTheDocument();
    expect(screen.getByTestId('botao-novo')).toBeInTheDocument();
    expect(screen.getByTestId('botao-voltar')).toBeInTheDocument();
  });

  it('chama navigate ao clicar em Voltar', () => {
    renderWithProvider(<BuscaAtivaHistoricoRegistroAcoes />);
    fireEvent.click(screen.getByTestId('botao-voltar'));
    expect(mockNavigate).toHaveBeenCalledWith(
      '/busca-ativa/criancas-estudantes/ausentes',
      expect.objectContaining({ state: defaultLocationState }),
    );
  });

  it('chama navigate ao clicar em Novo registro de ação', () => {
    renderWithProvider(<BuscaAtivaHistoricoRegistroAcoes />);
    expect(screen.getByTestId('botao-novo')).not.toBeDisabled();
    fireEvent.click(screen.getByTestId('botao-novo'));
    expect(mockNavigate).toHaveBeenCalledWith(
      '/busca-ativa/criancas-estudantes/ausentes/historico-registro-acoes/novo',
      expect.objectContaining({ state: defaultLocationState }),
    );
  });

  it('desabilita botão Novo registro de ação se não podeIncluir', () => {
    const stateSemPermissao = {
      usuario: {
        permissoes: {
          '/busca-ativa/consulta-criancas-estudantes-ausentes': { podeIncluir: false },
        },
      },
    };
    const storeSemPermissao = { ...mockStore, getState: () => stateSemPermissao };
    render(
      <Provider store={storeSemPermissao as any}>
        <BuscaAtivaHistoricoRegistroAcoes />
      </Provider>,
    );
    expect(screen.getByTestId('botao-novo')).toBeDisabled();
  });
});
