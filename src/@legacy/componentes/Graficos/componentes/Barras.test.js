import { render, screen } from '@testing-library/react';
import Barras from './Barras';

jest.mock('@nivo/bar', () => ({
  ResponsiveBar: ({
    data,
    indexBy,
    margin,
    axisBottom,
    legends,
    labelSkipWidth,
    labelSkipHeight,
    ...customProps
  }) => {
    if (legends[0].format) {
      data.forEach(d => legends[0].format(d.value));
    }

    return (
      <div
        data-testid="responsive-bar"
        data-indexby={indexBy}
        data-margin-top={margin.top}
        data-axis-bottom-null={axisBottom === null}
        data-labelskipwidth={labelSkipWidth}
        data-labelskipheight={labelSkipHeight}
        data-format-type={typeof legends[0].format}
        data-item-opacity={legends[0].itemOpacity}
        {...customProps}
      >
        {data.map((d, idx) => (
          <span key={idx}>{d[indexBy]}</span>
        ))}
      </div>
    );
  },
}));

describe('Componente Barras', () => {
  const sampleData = [
    { category: 'X', value: 5 },
    { category: 'Y', value: 15 },
  ];

  it('deve renderizar e exibir os dados corretamente', () => {
    render(
      <Barras
        dados={sampleData}
        indice="category"
        chaves={['value']}
        legendaBaixo="Leg X"
        legendaEsquerda="Leg Y"
      />
    );
    const bar = screen.getByTestId('responsive-bar');
    expect(bar).toBeInTheDocument();
    expect(screen.getByText('X')).toBeInTheDocument();
    expect(screen.getByText('Y')).toBeInTheDocument();
    expect(bar).toHaveAttribute('data-indexby', 'category');
  });

  it('deve aplicar o format de porcentagem quando porcentagem=true', () => {
    render(
      <Barras
        dados={sampleData}
        indice="category"
        chaves={['value']}
        legendaBaixo=""
        legendaEsquerda=""
        porcentagem
      />
    );
    const bar = screen.getByTestId('responsive-bar');
    expect(bar).toHaveAttribute('data-format-type', 'function');
  });

  it('deve ocultar o eixo inferior quando showAxisBottom=false', () => {
    render(
      <Barras
        dados={sampleData}
        indice="category"
        chaves={['value']}
        legendaBaixo=""
        legendaEsquerda=""
        showAxisBottom={false}
      />
    );
    expect(screen.getByTestId('responsive-bar')).toHaveAttribute(
      'data-axis-bottom-null',
      'true'
    );
  });

  it('deve aplicar margens personalizadas quando informado', () => {
    render(
      <Barras
        dados={sampleData}
        indice="category"
        chaves={['value']}
        legendaBaixo=""
        legendaEsquerda=""
        customMargins={{ top: 10, right: 0, bottom: 0, left: 0 }}
      />
    );
    expect(screen.getByTestId('responsive-bar')).toHaveAttribute(
      'data-margin-top',
      '10'
    );
  });

  it('deve remover as legendas quando removeLegends=true', () => {
    render(
      <Barras
        dados={sampleData}
        indice="category"
        chaves={['value']}
        legendaBaixo=""
        legendaEsquerda=""
        removeLegends
      />
    );
    expect(screen.getByTestId('responsive-bar')).toHaveAttribute(
      'data-item-opacity',
      '0'
    );
  });

  it('deve aplicar propriedades customizadas via customProps', () => {
    render(
      <Barras
        dados={sampleData}
        indice="category"
        chaves={['value']}
        legendaBaixo=""
        legendaEsquerda=""
        customProps={{ 'data-custom': 'test' }}
      />
    );
    expect(screen.getByTestId('responsive-bar')).toHaveAttribute(
      'data-custom',
      'test'
    );
  });

  it('deve ter o propTypes definido corretamente', () => {
    expect(Barras.propTypes).toBeDefined();
    expect(Barras.propTypes.dados).toBeDefined();
  });
});
