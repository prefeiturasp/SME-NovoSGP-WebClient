import { render, screen } from '@testing-library/react';
import Container from './container';

jest.mock('styled-components', () => {
  const React = require('react');
  const styled = {};
  styled.div = jest.fn().mockImplementation((...args) => {
    return React.forwardRef(({ children, ...props }, ref) => (
      <div ref={ref} data-testid="styled-container" {...props}>
        {children}
      </div>
    ));
  });
  return { __esModule: true, default: styled };
});

describe('Container', () => {
  it('renderiza com valores padrão', () => {
    render(<Container>Conteúdo teste</Container>);

    const container = screen.getByTestId('styled-container');
    expect(container).toBeInTheDocument();
    expect(container).toHaveAttribute('id', 'textEditor');
    expect(container).toHaveTextContent('Conteúdo teste');
  });

  it('renderiza com height e maxHeight customizados', () => {
    render(
      <Container height="200px" maxHeight="500px">
        Conteúdo teste
      </Container>
    );

    const container = screen.getByTestId('styled-container');
    expect(container).toBeInTheDocument();
  });

  it('renderiza com id customizado', () => {
    render(<Container id="custom-editor">Conteúdo teste</Container>);

    const container = screen.getByTestId('styled-container');
    expect(container).toHaveAttribute('id', 'custom-editor');
  });

  it('renderiza children corretamente', () => {
    const TestChild = () => <div>Componente filho teste</div>;
    render(
      <Container>
        <TestChild />
      </Container>
    );

    expect(screen.getByText('Componente filho teste')).toBeInTheDocument();
  });
});
