import { render, screen } from '@testing-library/react';
import HeaderPage from './index';

describe('HeaderPage', () => {
  it('renderiza o título corretamente', () => {
    render(<HeaderPage title="Título Teste" />);
    expect(screen.getByText('Título Teste')).toBeInTheDocument();
  });

  it('renderiza os children corretamente', () => {
    render(
      <HeaderPage title="Com Children">
        <div data-testid="conteudo-children">Conteúdo extra</div>
      </HeaderPage>,
    );
    expect(screen.getByText('Com Children')).toBeInTheDocument();
    expect(screen.getByTestId('conteudo-children')).toBeInTheDocument();
    expect(screen.getByText('Conteúdo extra')).toBeInTheDocument();
  });
});
