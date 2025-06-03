import { render, screen, waitFor, act } from '@testing-library/react';
import { useAppSelector } from '@/core/hooks/use-redux';
import frequenciaService from '@/core/services/frequencia-service';
import { ObjectCardMapeamentoEstudantes } from './index';
import '@testing-library/jest-dom';

jest.mock('@/core/hooks/use-redux');
jest.mock('@/core/services/frequencia-service');
jest.mock('~/componentes', () => ({
  Loader: ({ loading, children }: any) => (
    <div data-testid="loader">{loading ? 'Carregando' : children}</div>
  ),
  Base: {
    CinzaBordaCalendario: '#ccc',
    LaranjaAlerta: '#ffa500',
    VermelhoAlerta: '#ff0000',
    AmareloAlerta: '#ffff00',
  },
}));
jest.mock('~/componentes/Alunos/Detalhes', () => (props: any) => (
  <div data-testid="detalhes-aluno">{JSON.stringify(props)}</div>
));

describe('ObjectCardMapeamentoEstudantes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renderiza Loader e DetalhesAluno com dados e permiteAlterarImagem true', async () => {
    (useAppSelector as jest.Mock).mockImplementation((fn) =>
      fn({
        usuario: { turmaSelecionada: { turma: 'T1' } },
        mapeamentoEstudantes: {
          dadosAlunoObjectCard: { codigoEOL: 123, nome: 'Aluno Teste' },
          desabilitarCamposMapeamentoEstudantes: false,
        },
      }),
    );
    (frequenciaService.obterFrequenciaGeralAluno as jest.Mock).mockResolvedValue({ dados: 77 });
    await act(async () => {
      render(<ObjectCardMapeamentoEstudantes />);
    });
    const detalhes = await screen.findByTestId('detalhes-aluno');
    expect(detalhes).toBeInTheDocument();
    expect(detalhes.textContent).toContain('Aluno Teste');
    expect(detalhes.textContent).toContain('permiteAlterarImagem":true');
  });

  it('renderiza permiteAlterarImagem false quando desabilitarCamposMapeamentoEstudantes é true', async () => {
    (useAppSelector as jest.Mock).mockImplementation((fn) =>
      fn({
        usuario: { turmaSelecionada: { turma: 'T1' } },
        mapeamentoEstudantes: {
          dadosAlunoObjectCard: { codigoEOL: 123, nome: 'Aluno Teste' },
          desabilitarCamposMapeamentoEstudantes: true,
        },
      }),
    );
    (frequenciaService.obterFrequenciaGeralAluno as jest.Mock).mockResolvedValue({ dados: 77 });
    await act(async () => {
      render(<ObjectCardMapeamentoEstudantes />);
    });
    const detalhes = await screen.findByTestId('detalhes-aluno');
    expect(detalhes.textContent).toContain('permiteAlterarImagem":false');
  });

  it('renderiza DetalhesAluno com dados vazio se não houver dadosAlunoObjectCard', async () => {
    (useAppSelector as jest.Mock).mockImplementation((fn) =>
      fn({
        usuario: { turmaSelecionada: { turma: 'T1' } },
        mapeamentoEstudantes: {
          dadosAlunoObjectCard: undefined,
          desabilitarCamposMapeamentoEstudantes: false,
        },
      }),
    );
    await act(async () => {
      render(<ObjectCardMapeamentoEstudantes />);
    });
    const detalhes = screen.getByTestId('detalhes-aluno').textContent;
    expect(detalhes).toContain('dados":{}');
  });

  it('chama frequenciaService.obterFrequenciaGeralAluno quando dadosAlunoObjectCard e turma existem', async () => {
    (useAppSelector as jest.Mock).mockImplementation((fn) =>
      fn({
        usuario: { turmaSelecionada: { turma: 'T1' } },
        mapeamentoEstudantes: {
          dadosAlunoObjectCard: { codigoEOL: 123, nome: 'Aluno Teste' },
          desabilitarCamposMapeamentoEstudantes: false,
        },
      }),
    );
    (frequenciaService.obterFrequenciaGeralAluno as jest.Mock).mockResolvedValue({ dados: 77 });
    await act(async () => {
      render(<ObjectCardMapeamentoEstudantes />);
    });
    await waitFor(() => {
      expect(frequenciaService.obterFrequenciaGeralAluno).toHaveBeenCalledWith(123, 'T1');
    });
  });
});
