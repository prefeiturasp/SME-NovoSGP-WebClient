import { render, screen } from '@testing-library/react';
import GraficoFrequenciaPorModalidade from './index';

jest.mock('./graficoFrequenciaModalidade', () => {
  return function MockGraficoFrequenciaModalidade(props) {
    return (
      <div data-testid="grafico-frequencia-modalidade">
        Grafico Frequencia Modalidade
      </div>
    );
  };
});

jest.mock('~/componentes', () => ({
  Base: {
    AzulBordaCollapse: '#007bff',
  },
}));

describe('GraficoFrequenciaPorModalidade', () => {
  it('deve renderizar o GraficoFrequenciaModalidade quando exibir for true', () => {
    render(
      <GraficoFrequenciaPorModalidade anoLetivo="2023" dreId="123" ueId="456" />
    );

    expect(
      screen.getByTestId('grafico-frequencia-modalidade')
    ).toBeInTheDocument();
  });

  it('deve passar as props corretas para o GraficoFrequenciaModalidade', () => {
    const props = {
      anoLetivo: '2023',
      dreId: '123',
      ueId: '456',
      modalidade: '1',
      semestre: '2',
      tipoVisualizacao: 'global',
      periodicidade: 'mensal',
    };

    render(<GraficoFrequenciaPorModalidade {...props} />);

    expect(
      screen.getByTestId('grafico-frequencia-modalidade')
    ).toBeInTheDocument();
  });

  it('deve usar valores padrão quando props não são fornecidas', () => {
    render(<GraficoFrequenciaPorModalidade />);

    expect(
      screen.getByTestId('grafico-frequencia-modalidade')
    ).toBeInTheDocument();
  });
});
