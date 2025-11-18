import { render, screen } from '@testing-library/react';
import { GraficoBarras } from './index';

jest.mock('@ant-design/plots', () => ({
  Column: (props) => <div data-testid="column-chart" {...props} />,
}));

jest.mock('~/componentes/colors', () => ({
  Base: { CinzaMako: '#999999' },
  CoresGraficos: ['#000000', '#111111'],
}));

describe('GraficoBarras', () => {
  it('renderiza o gráfico Column quando dados são fornecidos', () => {
    const data = [
      { descricao: 'A', quantidade: 10 },
      { descricao: 'B', quantidade: 20 },
    ];
    render(<GraficoBarras data={data} />);
    expect(screen.getByTestId('column-chart')).toBeInTheDocument();
  });

  it('não renderiza nada quando não há dados', () => {
    const { container } = render(<GraficoBarras data={[]} />);
    expect(container.firstChild).toBeNull();
  });
});
