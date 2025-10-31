import { render, screen, within } from '@testing-library/react';
import TabelaIndicadoresPapDetalhes from './tabelaIndicadoresPapDetalhes';

const mockDadosCompletos = {
  nomeDificuldadeTop1: 'Interpretação de Texto',
  nomeDificuldadeTop2: 'Cálculos Matemáticos',
  quantidadesPorTipoPap: [
    {
      tipoPap: 1,
      tipoPapNome: 'PAP Colaborativo',
      totalTurmas: 100,
      totalAlunos: 500,
      totalAlunosComFrequenciaInferiorLimite: 10,
      totalAlunosDificuldadeTop1: 25,
      totalAlunosDificuldadeTop2: 30,
      totalAlunosDificuldadeOutras: 40,
    },
    {
      tipoPap: 2,
      tipoPapNome: 'Recuperação',
      totalTurmas: 50,
      totalAlunos: 200,
      totalAlunosComFrequenciaInferiorLimite: 5,
      totalAlunosDificuldadeTop1: 15,
      totalAlunosDificuldadeTop2: 20,
      totalAlunosDificuldadeOutras: 10,
    },
  ],
};

const mockDadosSemNomesDificuldade = {
  quantidadesPorTipoPap: [
    {
      tipoPap: 1,
      tipoPapNome: 'PAP Colaborativo',
      totalTurmas: 100,
      totalAlunos: 500,
      totalAlunosComFrequenciaInferiorLimite: 10,
      totalAlunosDificuldadeTop1: 25,
      totalAlunosDificuldadeTop2: 30,
      totalAlunosDificuldadeOutras: 40,
    },
  ],
};

const mockDadosComArrayVazio = {
  nomeDificuldadeTop1: 'Interpretação de Texto',
  nomeDificuldadeTop2: 'Cálculos Matemáticos',
  quantidadesPorTipoPap: [],
};


describe('TabelaIndicadoresPapDetalhes', () => {
  it('deve renderizar os cabeçalhos dinâmicos e os dados quando o prop "dados" está completo', () => {
    render(<TabelaIndicadoresPapDetalhes dados={mockDadosCompletos} />);

    expect(screen.getByRole('columnheader', { name: 'Tipo do PAP' })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'Interpretação de Texto' })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'Cálculos Matemáticos' })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'Outros' })).toBeInTheDocument();

    const primeiraLinha = screen.getByRole('row', { name: /PAP Colaborativo/i });
    expect(within(primeiraLinha).getByRole('cell', { name: 'PAP Colaborativo' })).toBeInTheDocument();
    expect(within(primeiraLinha).getByRole('cell', { name: '100' })).toBeInTheDocument(); // Qtde. de turmas
    expect(within(primeiraLinha).getByRole('cell', { name: '500' })).toBeInTheDocument(); // Qtde. de estudantes
    expect(within(primeiraLinha).getByRole('cell', { name: '25' })).toBeInTheDocument(); // Dificuldade 1
  });

  it('deve renderizar os cabeçalhos de fallback quando os nomes das dificuldades não são fornecidos', () => {
    render(<TabelaIndicadoresPapDetalhes dados={mockDadosSemNomesDificuldade} />);
    expect(screen.getByRole('columnheader', { name: 'Leitura' })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'Resolução de problema' })).toBeInTheDocument();
    expect(screen.queryByRole('columnheader', { name: 'Interpretação de Texto' })).not.toBeInTheDocument();
    expect(screen.queryByRole('columnheader', { name: 'Cálculos Matemáticos' })).not.toBeInTheDocument();
  });

  it('deve renderizar a tabela com uma mensagem de "Nenhum dado" quando o array de quantidades está vazio', () => {
    render(<TabelaIndicadoresPapDetalhes dados={mockDadosComArrayVazio} />);
    expect(screen.getByRole('columnheader', { name: 'Tipo do PAP' })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'Interpretação de Texto' })).toBeInTheDocument();
    expect(screen.getByText('No data')).toBeInTheDocument();
  });

    it('deve renderizar a tabela com a mensagem "No data" quando o prop "dados" é nulo', () => {
    render(<TabelaIndicadoresPapDetalhes dados={null} />);
    expect(screen.getByRole('columnheader', { name: 'Leitura' })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'Resolução de problema' })).toBeInTheDocument();
    expect(screen.getByText('No data')).toBeInTheDocument();
    });
});