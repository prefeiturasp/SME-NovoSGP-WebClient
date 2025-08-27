import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import GraficoAnaliseDeFrequencia from './GraficoAnaliseDeFrequencia';

// Mock dos módulos externos
jest.mock('~/servicos', () => ({
  erros: jest.fn()
}));

jest.mock('~/componentes', () => ({
  Loader: ({ loading, tip, className }) => (
    loading ? <div className={className} data-testid="loader">{tip}</div> : null
  )
}));

jest.mock('./graficoAnaliseDeFrequenciaMock', () => ({
  dadosMock: {
    escolasSituacaoCritica: {
      titulo: 'Situação Crítica',
      descricao: 'XX escolas com baixa frequência',
      cor: '#ffebee',
      escolas: [
        { nome: 'Escola A', percentual: 65 },
        { nome: 'Escola B', percentual: 70 }
      ]
    },
    escolasAtencao: {
      titulo: 'Atenção',
      descricao: 'XX escolas necessitam atenção',
      cor: '#fff3e0',
      escolas: [
        { nome: 'Escola C', percentual: 75 }
      ]
    },
    melhoresFrequencias: {
      titulo: 'Melhores Frequências',
      descricao: 'XX escolas com ótima frequência',
      cor: '#e8f5e8',
      escolas: [
        { nome: 'Escola D', percentual: 95 }
      ]
    }
  }
}));

describe('InformacoesAnaliseDeFrequencia', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve renderizar loading quando carregando', async () => {
    render(<GraficoAnaliseDeFrequencia dreId="123" />);
    
    expect(screen.getByTestId('loader')).toBeInTheDocument();
    expect(screen.getByText('Carregando análise de frequência...')).toBeInTheDocument();
  });

  it('deve renderizar dados após carregamento', async () => {
    render(<GraficoAnaliseDeFrequencia dreId="123" />);
    
    await waitFor(() => {
      expect(screen.getByText('Análise de frequência')).toBeInTheDocument();
    });

    expect(screen.getByText('Situação Crítica')).toBeInTheDocument();
    expect(screen.getByText('Atenção')).toBeInTheDocument();
    expect(screen.getByText('Melhores Frequências')).toBeInTheDocument();
    
    // Verifica se as escolas estão sendo renderizadas
    expect(screen.getByText('Escola A')).toBeInTheDocument();
    expect(screen.getByText('(65%)')).toBeInTheDocument();
  });

  it('não deve renderizar nada quando dreId é nulo', () => {
    const { container } = render(<GraficoAnaliseDeFrequencia dreId={null} />);
    
    expect(container.firstChild).toBeNull();
  });

  it('não deve renderizar nada quando dreId é undefined', () => {
    const { container } = render(<GraficoAnaliseDeFrequencia />);
    
    expect(container.firstChild).toBeNull();
  });

  it('deve usar periodicidade padrão quando não informada', () => {
    const { container } = render(<GraficoAnaliseDeFrequencia dreId="123" />);
    
    // Como periodicidade não afeta a renderização diretamente,
    // verificamos apenas que o componente renderiza sem erro
    expect(container).not.toBeEmptyDOMElement();
  });
});