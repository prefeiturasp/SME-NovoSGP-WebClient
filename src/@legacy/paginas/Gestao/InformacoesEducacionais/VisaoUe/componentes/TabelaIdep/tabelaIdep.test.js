import { render, waitFor } from '@testing-library/react';
import TabelaIdep from './tabelaIdep';

jest.mock('~/servicos/InformacoesEducacionais/ServicoIdepTabela', () => ({
  obterIdepTabela: jest.fn(),
}));

jest.mock('~/servicos/alertas', () => ({
  erros: jest.fn(),
}));

jest.mock('./tabelaIdepDetalhes', () => () => <div>Tabela Detalhes</div>);

jest.mock('~/componentes', () => ({
  Loader: () => <div>Carregando...</div>,
}));

describe('TabelaIdep', () => {
  const ServicoIdepTabela = require('~/servicos/InformacoesEducacionais/ServicoIdepTabela');
  const { erros } = require('~/servicos/alertas');

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve buscar dados quando o componente é montado', async () => {
    const mockDados = [{ id: 1, nome: 'Teste' }];
    ServicoIdepTabela.obterIdepTabela.mockResolvedValue({ data: mockDados });

    render(<TabelaIdep anoLetivo="2023" ueCodigo="123" />);

    await waitFor(() => {
      expect(ServicoIdepTabela.obterIdepTabela).toHaveBeenCalledWith(
        '2023',
        '123'
      );
    });
  });

  it('deve tratar erro quando a requisição falhar', async () => {
    const mockError = new Error('Erro');
    ServicoIdepTabela.obterIdepTabela.mockRejectedValue(mockError);

    render(<TabelaIdep anoLetivo="2023" ueCodigo="123" />);

    await waitFor(() => {
      expect(erros).toHaveBeenCalledWith(mockError);
    });
  });
});
