import React from 'react';
import { render, screen } from '@testing-library/react';
import { LoaderMapeamentoEstudantes } from './index';
import { useAppSelector } from '@/core/hooks/use-redux';

jest.mock('@/core/hooks/use-redux');

jest.mock('~/componentes', () => ({
  Loader: ({ loading, children }: { loading: boolean; children: React.ReactNode }) =>
    loading ? <div data-testid="loader" /> : <>{children}</>,
}));

describe('LoaderMapeamentoEstudantes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('exibe o loader quando o estado é true', () => {
    (useAppSelector as jest.Mock).mockReturnValue(true);

    render(
      <LoaderMapeamentoEstudantes>
        <div data-testid="child">Olá</div>
      </LoaderMapeamentoEstudantes>,
    );

    expect(screen.getByTestId('loader')).toBeInTheDocument();
    expect(screen.queryByTestId('child')).toBeNull();
  });

  it('exibe os children quando o estado é false', () => {
    (useAppSelector as jest.Mock).mockReturnValue(false);

    render(
      <LoaderMapeamentoEstudantes>
        <div data-testid="child">Mundo</div>
      </LoaderMapeamentoEstudantes>,
    );

    expect(screen.getByTestId('child')).toBeInTheDocument();
    expect(screen.queryByTestId('loader')).toBeNull();
  });

  it('usa o selector correto para pegar o exibirLoaderMapeamentoEstudantes', () => {
    (useAppSelector as jest.Mock).mockReturnValue(false);
    render(
      <LoaderMapeamentoEstudantes>
        <></>
      </LoaderMapeamentoEstudantes>,
    );

    expect(useAppSelector).toHaveBeenCalledTimes(1);
    const selector = (useAppSelector as jest.Mock).mock.calls[0][0];
    const fakeStore = { mapeamentoEstudantes: { exibirLoaderMapeamentoEstudantes: 123 } };
    expect(selector(fakeStore)).toBe(123);
  });
});
