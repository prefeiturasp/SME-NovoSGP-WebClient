import React from 'react';
import { render, screen } from '@testing-library/react';
import RelatorioOcorrencias from './relatorioOcorrencias';

jest.mock('~/componentes', () => ({
  Loader: ({ loading, children }) => <div data-testid="loader">{children}</div>,
  Card: ({ children }) => <div data-testid="card">{children}</div>,
  momentSchema: {
    required: () => ({
      test: () => true,
    }),
  },
}));

jest.mock('~/componentes-sgp', () => ({
  Cabecalho: ({ children }) => <div data-testid="cabecalho">{children}</div>,
}));

jest.mock('./relatorioOcorrenciasBotoesAcoes', () => () => (
  <div data-testid="relatorio-botoes">Botões</div>
));

jest.mock('./relatorioOcorrenciasForm', () => () => (
  <div data-testid="relatorio-form">Formulário</div>
));

jest.mock('formik', () => {
  const actualFormik = jest.requireActual('formik');
  return {
    ...actualFormik,
    Formik: ({ children, initialValues }) => (
      <div data-testid="formik">{children({ values: initialValues })}</div>
    ),
  };
});

describe('RelatorioOcorrencias', () => {
  it('deve renderizar corretamente com os componentes principais', () => {
    render(<RelatorioOcorrencias />);

    expect(screen.getByTestId('loader')).toBeInTheDocument();
    expect(screen.getByTestId('cabecalho')).toBeInTheDocument();
    expect(screen.getByTestId('relatorio-botoes')).toBeInTheDocument();
    expect(screen.getByTestId('card')).toBeInTheDocument();
    expect(screen.getByTestId('relatorio-form')).toBeInTheDocument();
  });
});
