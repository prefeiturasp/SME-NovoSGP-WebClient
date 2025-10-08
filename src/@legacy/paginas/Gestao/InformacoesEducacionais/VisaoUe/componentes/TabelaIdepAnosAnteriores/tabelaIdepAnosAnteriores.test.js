import { render, waitFor } from '@testing-library/react';
import TabelaIdepAnosAnteriores from './tabelaIdepAnosAnteriores';

jest.mock('~/servicos/InformacoesEducacionais/ServicoIdepTabela', () => ({
  obterIdepTabela: jest.fn(),
}));

jest.mock('~/servicos/alertas', () => ({
  erros: jest.fn(),
}));

jest.mock(
  './tabelaIdepAnosAnterioresDetalhes',
  () =>
    ({ dados, carregando }) =>
      (
        <div data-testid="tabela-detalhes">
          Dados: {dados.length}, Carregando: {carregando.toString()}
        </div>
      )
);

jest.mock('~/componentes', () => ({
  Loader: ({ loading, tip }) => (
    <div data-testid="loader">
      {loading ? `Loading: ${tip}` : 'Not loading'}
    </div>
  ),
}));

describe('TabelaIdepAnosAnteriores', () => {
  const ServicoIdepTabela = require('~/servicos/InformacoesEducacionais/ServicoIdepTabela');
  const { erros } = require('~/servicos/alertas');

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve chamar o serviço com anoLetivo null quando montar', async () => {
    const mockDados = [{ ano: 2022, idep: 7.5 }];
    ServicoIdepTabela.obterIdepTabela.mockResolvedValue({ data: mockDados });

    render(<TabelaIdepAnosAnteriores ueCodigo="123" />);

    await waitFor(() => {
      expect(ServicoIdepTabela.obterIdepTabela).toHaveBeenCalledWith(
        null,
        '123'
      );
    });
  });

  it('deve chamar função de erro quando serviço falhar', async () => {
    const mockError = new Error('Erro API');
    ServicoIdepTabela.obterIdepTabela.mockRejectedValue(mockError);

    render(<TabelaIdepAnosAnteriores ueCodigo="123" />);

    await waitFor(() => {
      expect(erros).toHaveBeenCalledWith(mockError);
    });
  });

  it('deve buscar dados novamente quando ueCodigo mudar', async () => {
    ServicoIdepTabela.obterIdepTabela.mockResolvedValue({ data: [] });

    const { rerender } = render(<TabelaIdepAnosAnteriores ueCodigo="123" />);

    await waitFor(() => {
      expect(ServicoIdepTabela.obterIdepTabela).toHaveBeenCalledWith(
        null,
        '123'
      );
    });

    rerender(<TabelaIdepAnosAnteriores ueCodigo="456" />);

    await waitFor(() => {
      expect(ServicoIdepTabela.obterIdepTabela).toHaveBeenCalledWith(
        null,
        '456'
      );
    });

    expect(ServicoIdepTabela.obterIdepTabela).toHaveBeenCalledTimes(2);
  });
});
