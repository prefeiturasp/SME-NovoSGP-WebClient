import { render, screen } from '@testing-library/react';
import CardContent from './index';

describe('CardContent', () => {
  it('renderiza os children corretamente', () => {
    render(
      <CardContent>
        <div data-testid="conteudo-card">Conteúdo do Card</div>
      </CardContent>,
    );
    expect(screen.getByTestId('conteudo-card')).toBeInTheDocument();
    expect(screen.getByText('Conteúdo do Card')).toBeInTheDocument();
  });
});
