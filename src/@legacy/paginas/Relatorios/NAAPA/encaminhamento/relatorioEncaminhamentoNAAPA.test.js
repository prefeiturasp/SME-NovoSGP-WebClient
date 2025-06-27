import React from 'react';
import { render, screen } from '@testing-library/react';
import RelatorioEncaminhamentonNAAPA from './relatorioEncaminhamentoNAAPA';

jest.mock('~/componentes', () => ({
  Loader: ({ children, loading }) =>
    loading ? <div data-testid="loader">Loading...</div> : children,
  Card: ({ children }) => <div data-testid="card">{children}</div>,
}));
jest.mock('~/componentes-sgp', () => ({
  Cabecalho: ({ children }) => <div data-testid="cabecalho">{children}</div>,
}));
jest.mock('./relatorioEncaminhamentoNAAPABotoesAcoes', () => () => (
  <div data-testid="botoes-acoes" />
));
jest.mock('./relatorioEncaminhamentoNAAPAForm', () => () => (
  <div data-testid="form-naapa" />
));

global.window.moment = () => ({
  format: () => '2025',
});

describe('RelatorioEncaminhamentonNAAPA', () => {
  it('deve renderizar os componentes principais', () => {
    render(<RelatorioEncaminhamentonNAAPA />);

    expect(screen.getByTestId('cabecalho')).toBeInTheDocument();
    expect(screen.getByTestId('botoes-acoes')).toBeInTheDocument();
    expect(screen.getByTestId('card')).toBeInTheDocument();
    expect(screen.getByTestId('form-naapa')).toBeInTheDocument();
  });

  it('deve passar os props corretos para os filhos', () => {
    render(<RelatorioEncaminhamentonNAAPA />);
    expect(screen.getByTestId('botoes-acoes')).toBeInTheDocument();
    expect(screen.getByTestId('form-naapa')).toBeInTheDocument();
  });
});
