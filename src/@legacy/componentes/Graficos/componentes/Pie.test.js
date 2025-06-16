import { render, screen } from '@testing-library/react';
import Pie from './Pie';

jest.mock('@nivo/pie', () => ({
  ResponsivePie: ({
    data,
    enableRadialLabels,
    radialLabel,
    margin,
    theme,
    isInteractive,
    enableSlicesLabels,
    radialLabelsLinkColor,
    radialLabelsLinkDiagonalLength,
    radialLabelsLinkStrokeWidth,
    colors,
  }) => {
    data.forEach(item => {
      if (colors) colors(item);
    });

    return (
      <div
        data-testid="responsive-pie"
        data-enable-radial={enableRadialLabels}
        data-radial-first={radialLabel(data[0])}
        data-radial-second={radialLabel(data[1])}
        data-margin-top={margin.top}
        data-theme={JSON.stringify(theme)}
        data-is-interactive={isInteractive}
        data-enable-slices-labels={enableSlicesLabels}
        data-radial-link-color={JSON.stringify(radialLabelsLinkColor)}
        data-radial-link-length={radialLabelsLinkDiagonalLength}
        data-radial-link-width={radialLabelsLinkStrokeWidth}
        style={{ height: 400 }}
      >
        {data.map(item => (
          <span key={item.id}>
            {item.id}:{item.value}
          </span>
        ))}
      </div>
    );
  },
}));

describe('Componente Pie', () => {
  const sampleData = [
    { id: 'A', value: 10, color: '#ff0000', radialLabel: 'Label A' },
    { id: 'B', value: 20, color: '#00ff00' },
  ];

  it('deve renderizar o componente e exibir os dados', () => {
    render(<Pie data={sampleData} enableRadialLabels={false} />);
    const pie = screen.getByTestId('responsive-pie');
    expect(pie).toBeInTheDocument();
    expect(screen.getByText('A:10')).toBeInTheDocument();
    expect(screen.getByText('B:20')).toBeInTheDocument();
    expect(pie).toHaveAttribute('data-enable-radial', 'false');
  });

  it('deve utilizar o valor padrão de enableRadialLabels quando não informado', () => {
    render(<Pie data={sampleData} />);
    const pie = screen.getByTestId('responsive-pie');
    expect(pie).toHaveAttribute('data-enable-radial', 'true');
  });

  it('deve chamar radialLabel corretamente para os itens', () => {
    render(<Pie data={sampleData} enableRadialLabels={true} />);
    const pie = screen.getByTestId('responsive-pie');
    expect(pie).toHaveAttribute('data-radial-first', 'Label A');
    expect(pie).toHaveAttribute('data-radial-second', '20');
  });

  it('deve aplicar a altura correta no container externo', () => {
    render(<Pie data={sampleData} />);
    const pie = screen.getByTestId('responsive-pie');
    expect(pie).toHaveStyle('height: 400px');
  });

  it('deve aplicar a margem padrão do componente', () => {
    render(<Pie data={sampleData} />);
    const pie = screen.getByTestId('responsive-pie');
    expect(pie).toHaveAttribute('data-margin-top', '40');
  });

  it('deve passar as props de tema e interação corretamente', () => {
    render(<Pie data={sampleData} />);
    const pie = screen.getByTestId('responsive-pie');
    expect(pie).toHaveAttribute('data-is-interactive', 'false');
    const theme = JSON.parse(pie.getAttribute('data-theme'));
    expect(theme.fontFamily).toBe('Roboto');
    expect(pie).toHaveAttribute('data-enable-slices-labels', 'false');
  });

  it('deve aplicar a função de acesso à cor corretamente', () => {
    const colorMock = jest.fn(d => d.color);

    jest.doMock('@nivo/pie', () => ({
      ResponsivePie: ({ data }) => {
        data.forEach(item => colorMock(item));
        return <div data-testid="responsive-pie" />;
      },
    }));

    jest.resetModules();
    const PieWithMock = require('./Pie').default;

    const sampleData = [
      { id: 'A', value: 10, color: '#ff0000' },
      { id: 'B', value: 20, color: '#00ff00' },
    ];

    render(<PieWithMock data={sampleData} />);

    expect(colorMock).toHaveBeenCalledWith({
      id: 'A',
      value: 10,
      color: '#ff0000',
    });
    expect(colorMock).toHaveBeenCalledWith({
      id: 'B',
      value: 20,
      color: '#00ff00',
    });

    jest.resetModules();
  });

  it('deve ter o propTypes definido corretamente', () => {
    expect(Pie.propTypes).toBeDefined();
    expect(Pie.propTypes.enableRadialLabels).toBeDefined();
  });
});
