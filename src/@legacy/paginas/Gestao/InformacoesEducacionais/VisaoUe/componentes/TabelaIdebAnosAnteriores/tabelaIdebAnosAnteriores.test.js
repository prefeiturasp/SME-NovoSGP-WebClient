import { render, waitFor } from '@testing-library/react';
import TabelaIdebAnosAnteriores from './tabelaIdebAnosAnteriores';

jest.mock('~/servicos/InformacoesEducacionais/ServicoIdebTabela', () => ({
  obterIdebTabela: jest.fn(),
}));

jest.mock('~/servicos/alertas', () => ({
  erros: jest.fn(),
}));

jest.mock(
  './tabelaIdebAnosAnterioresDetalhes',
  () =>
    ({ dados = [] }) =>
      (
        <div data-testid="tabela-detalhes">
          Dados: {dados.length}
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

describe('TabelaIdebAnosAnteriores', () => {
  const ServicoIdebTabela = require('~/servicos/InformacoesEducacionais/ServicoIdebTabela');
  const { erros } = require('~/servicos/alertas');

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve chamar o serviço com anoLetivo null quando montar', async () => {
    const mockDados = [{ ano: 2022, ideb: 7.5 }];
    ServicoIdebTabela.obterIdebTabela.mockResolvedValue({ data: mockDados });

    render(<TabelaIdebAnosAnteriores ueCodigo="123" />);

    await waitFor(() => {
      expect(ServicoIdebTabela.obterIdebTabela).toHaveBeenCalledWith(
        null,
        '123'
      );
    });
  });

  it('deve chamar função de erro quando serviço falhar', async () => {
    const mockError = new Error('Erro API');
    ServicoIdebTabela.obterIdebTabela.mockRejectedValue(mockError);

    render(<TabelaIdebAnosAnteriores ueCodigo="123" />);

    await waitFor(() => {
      expect(erros).toHaveBeenCalledWith(mockError);
    });
  });

  it('deve buscar dados novamente quando ueCodigo mudar', async () => {
    ServicoIdebTabela.obterIdebTabela.mockResolvedValue({ data: [] });

    const { rerender } = render(<TabelaIdebAnosAnteriores ueCodigo="123" />);

    await waitFor(() => {
      expect(ServicoIdebTabela.obterIdebTabela).toHaveBeenCalledWith(
        null,
        '123'
      );
    });

    rerender(<TabelaIdebAnosAnteriores ueCodigo="456" />);

    await waitFor(() => {
      expect(ServicoIdebTabela.obterIdebTabela).toHaveBeenCalledWith(
        null,
        '456'
      );
    });

    expect(ServicoIdebTabela.obterIdebTabela).toHaveBeenCalledTimes(2);
  });
});
