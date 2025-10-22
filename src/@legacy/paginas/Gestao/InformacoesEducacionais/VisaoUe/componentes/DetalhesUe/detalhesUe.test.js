import { render, screen, waitFor } from '@testing-library/react';
import DetalhesUe from './DetalhesUe';

jest.mock('~/servicos/InformacoesEducacionais/ServicoDetalhesUe', () => ({
  obterDetalhesUe: jest.fn(),
}));

jest.mock('~/servicos', () => ({
  erros: jest.fn(),
}));

import { erros } from '~/servicos';
import ServicoDetalhesUe from '~/servicos/InformacoesEducacionais/ServicoDetalhesUe';

describe('Componente DetalhesUe', () => {
  const mockDados = {
    diretor: 'Maria Silva',
    telefone: '(11) 9999-9999',
    email: 'escola@exemplo.com',
    codigoEol: '123456',
    codigoInep: '654321',
  };

  const propsPadrao = {
    codigoUe: '123',
    nomeUe: 'Escola Teste',
    nomeDre: 'DRE Teste',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve exibir loading inicialmente', () => {
    ServicoDetalhesUe.obterDetalhesUe.mockResolvedValue({ data: mockDados });

    render(<DetalhesUe {...propsPadrao} />);

    expect(screen.getByText('Carregando...')).toBeInTheDocument();
  });

  it('deve exibir dados corretamente após carregamento', async () => {
    ServicoDetalhesUe.obterDetalhesUe.mockResolvedValue({ data: mockDados });

    render(<DetalhesUe {...propsPadrao} />);

    await waitFor(() => {
      expect(screen.getByText('Escola Teste')).toBeInTheDocument();
    });

    expect(screen.getByText('Escola Teste')).toBeInTheDocument();
    expect(screen.getByText('DRE DRE Teste')).toBeInTheDocument();
    expect(screen.getByText('Maria Silva')).toBeInTheDocument();
    expect(screen.getByText('(11) 9999-9999')).toBeInTheDocument();
    expect(screen.getByText('escola@exemplo.com')).toBeInTheDocument();
    expect(screen.getByText('123456')).toBeInTheDocument();
    expect(screen.getByText('654321')).toBeInTheDocument();
  });

  it('deve exibir mensagem de erro quando serviço falhar', async () => {
    ServicoDetalhesUe.obterDetalhesUe.mockRejectedValue(new Error('Erro'));

    render(<DetalhesUe {...propsPadrao} />);

    await waitFor(() => {
      expect(screen.getByText('Nenhum dado encontrado.')).toBeInTheDocument();
    });
  });

  it('não deve chamar serviço quando codigoUe for vazio', () => {
    render(<DetalhesUe codigoUe={null} />);

    expect(ServicoDetalhesUe.obterDetalhesUe).not.toHaveBeenCalled();
  });
});
