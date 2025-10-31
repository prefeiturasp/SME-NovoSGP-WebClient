import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import GraficoFrequenciaSemanal from './GraficoFrequenciaSemanal';

jest.mock('~/servicos/InformacoesEducacionais/ServicoFrequenciaGrafico', () => {
  const obterFrequenciaGrafico = jest.fn();
  return {
    __esModule: true,
    default: { obterFrequenciaGrafico },
    obterFrequenciaGrafico,
  };
});
import ServicoFrequenciaGrafico from '~/servicos/InformacoesEducacionais/ServicoFrequenciaGrafico';

jest.mock('@ant-design/plots', () => ({
  Line: () => <div data-testid="line-chart" />,
}));

describe('GraficoFrequenciaSemanal', () => {
  const mockDados = [
    { dataAula: '03/02/2025', percentualFrequencia: 80 },
    { dataAula: '10/02/2025', percentualFrequencia: 60 },
    { dataAula: '17/02/2025', percentualFrequencia: 90 },
    { dataAula: '24/02/2025', percentualFrequencia: 70 },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renderiza o gráfico quando o serviço retorna dados', async () => {
    ServicoFrequenciaGrafico.obterFrequenciaGrafico.mockResolvedValue({
      status: 200,
      data: mockDados,
    });

    render(<GraficoFrequenciaSemanal ueCodigo={1} anoLetivo={2025} />);

    expect(await screen.findByTestId('line-chart')).toBeInTheDocument();
    expect(screen.queryByText('Sem dados disponíveis')).not.toBeInTheDocument();
    expect(
      ServicoFrequenciaGrafico.obterFrequenciaGrafico
    ).toHaveBeenCalledWith(1, 2025);
  });

  it('exibe "Sem dados disponíveis" quando o serviço retorna lista vazia', async () => {
    ServicoFrequenciaGrafico.obterFrequenciaGrafico.mockResolvedValue({
      status: 200,
      data: [],
    });

    render(<GraficoFrequenciaSemanal ueCodigo={1} anoLetivo={2025} />);

    expect(
      await screen.findByText('Sem dados disponíveis')
    ).toBeInTheDocument();
    expect(screen.queryByTestId('line-chart')).not.toBeInTheDocument();
  });

  it('exibe "Sem dados disponíveis" quando o serviço falha', async () => {
    ServicoFrequenciaGrafico.obterFrequenciaGrafico.mockRejectedValue(
      new Error('Erro ao carregar')
    );

    render(<GraficoFrequenciaSemanal ueCodigo={1} anoLetivo={2025} />);

    expect(
      await screen.findByText('Sem dados disponíveis')
    ).toBeInTheDocument();
    expect(screen.queryByTestId('line-chart')).not.toBeInTheDocument();
  });
});
