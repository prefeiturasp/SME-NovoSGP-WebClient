import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useAppSelector } from '@/core/hooks/use-redux';
import LoaderBuscaAtivaRegistroAcoesForm from './loaderBuscaAtivaRegistroAcoesForm';

jest.mock('@/core/hooks/use-redux', () => ({
  useAppSelector: jest.fn(),
}));

jest.mock('~/componentes', () => ({
  Loader: ({ loading, children }: { loading: boolean; children: React.ReactNode }) => (
    <div data-testid="mock-loader" data-loading={String(loading)}>
      {children}
    </div>
  ),
}));

const mockedUseAppSelector = useAppSelector as jest.Mock;

describe('LoaderBuscaAtivaRegistroAcoesForm', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deve passar a propriedade loading como true para o Loader quando o estado do Redux for true', () => {
    mockedUseAppSelector.mockReturnValue(true);

    const childText = 'Conteúdo a ser renderizado';

    render(
      <LoaderBuscaAtivaRegistroAcoesForm>
        <p>{childText}</p>
      </LoaderBuscaAtivaRegistroAcoesForm>,
    );

    const loaderComponent = screen.getByTestId('mock-loader');
    const childElement = screen.getByText(childText);

    expect(loaderComponent).toHaveAttribute('data-loading', 'true');

    expect(childElement).toBeInTheDocument();
  });

  it('deve passar a propriedade loading como false para o Loader quando o estado do Redux for false', () => {
    mockedUseAppSelector.mockReturnValue(false);

    const childText = 'Conteúdo visível';

    render(
      <LoaderBuscaAtivaRegistroAcoesForm>
        <h1>{childText}</h1>
      </LoaderBuscaAtivaRegistroAcoesForm>,
    );

    const loaderComponent = screen.getByTestId('mock-loader');
    const childElement = screen.getByText(childText);

    expect(loaderComponent).toHaveAttribute('data-loading', 'false');

    expect(childElement).toBeInTheDocument();
  });
});
