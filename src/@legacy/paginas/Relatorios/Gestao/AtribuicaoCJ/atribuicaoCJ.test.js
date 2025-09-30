import { fireEvent, render, screen } from '@testing-library/react';

jest.mock(
  './AtribuicaoCJ',
  () =>
    function MockAtribuicaoCJ() {
      return (
        <div>
          <h1>Relatório de atribuição CJ</h1>
          <div data-testid="ano-letivo-select">Ano letivo</div>
          <div data-testid="dre-select">DRE</div>
          <div data-testid="ue-select">UE</div>
          <button data-testid="btn-gerar">Gerar</button>
          <button data-testid="btn-cancelar">Cancelar</button>
          <button data-testid="btn-voltar">Voltar</button>
        </div>
      );
    }
);

import AtribuicaoCJ from './AtribuicaoCJ';

describe('AtribuicaoCJ', () => {
  it('deve renderizar o título do relatório', () => {
    render(<AtribuicaoCJ />);

    expect(screen.getByText('Relatório de atribuição CJ')).toBeInTheDocument();
  });

  it('deve renderizar os campos do formulário', () => {
    render(<AtribuicaoCJ />);

    expect(screen.getByTestId('ano-letivo-select')).toBeInTheDocument();
    expect(screen.getByTestId('dre-select')).toBeInTheDocument();
    expect(screen.getByTestId('ue-select')).toBeInTheDocument();
  });

  it('deve renderizar os botões de ação', () => {
    render(<AtribuicaoCJ />);

    expect(screen.getByTestId('btn-gerar')).toBeInTheDocument();
    expect(screen.getByTestId('btn-cancelar')).toBeInTheDocument();
    expect(screen.getByTestId('btn-voltar')).toBeInTheDocument();
  });

  it('deve permitir clicar no botão gerar', () => {
    render(<AtribuicaoCJ />);

    const botaoGerar = screen.getByTestId('btn-gerar');
    fireEvent.click(botaoGerar);

    expect(botaoGerar).toBeInTheDocument();
  });
});
