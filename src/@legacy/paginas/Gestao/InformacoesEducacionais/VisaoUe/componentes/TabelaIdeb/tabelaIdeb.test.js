import { render, waitFor } from '@testing-library/react';
import TabelaIdeb from './tabelaIdeb';

jest.mock('~/servicos/InformacoesEducacionais/ServicoIdebTabela', () => ({
  obterIdebTabela: jest.fn(),
}));

jest.mock('~/servicos/alertas', () => ({
  erros: jest.fn(),
}));

jest.mock('./tabelaIdebDetalhes', () => () => <div>Tabela Detalhes</div>);

jest.mock('~/componentes', () => ({
  Loader: () => <div>Carregando...</div>,
}));

describe('TabelaIdeb', () => {
  const ServicoIdebTabela = require('~/servicos/InformacoesEducacionais/ServicoIdebTabela');
  const { erros } = require('~/servicos/alertas');

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve buscar dados quando o componente é montado', async () => {
    const mockDados = [{ id: 1, nome: 'Teste' }];
    ServicoIdebTabela.obterIdebTabela.mockResolvedValue({ data: mockDados });

    render(<TabelaIdeb anoLetivo="2023" ueCodigo="123" />);

    await waitFor(() => {
      expect(ServicoIdebTabela.obterIdebTabela).toHaveBeenCalledWith(
        '2023',
        '123'
      );
    });
  });

  it('deve tratar erro quando a requisição falhar', async () => {
    const mockError = new Error('Erro');
    ServicoIdebTabela.obterIdebTabela.mockRejectedValue(mockError);

    render(<TabelaIdeb anoLetivo="2023" ueCodigo="123" />);

    await waitFor(() => {
      expect(erros).toHaveBeenCalledWith(mockError);
    });
  });
});
