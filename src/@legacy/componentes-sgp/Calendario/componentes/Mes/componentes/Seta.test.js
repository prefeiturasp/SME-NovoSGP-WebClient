import { render } from '@testing-library/react';
import Seta from './Seta';

describe('Seta', () => {
  it('renderiza fa-chevron-right quando fechado (padrão)', () => {
    const { container } = render(<Seta />);
    const icon = container.querySelector('i');
    expect(icon).toHaveClass('fa-chevron-right');
    expect(icon).not.toHaveClass('fa-chevron-down');
  });

  it('renderiza fa-chevron-down quando estaAberto=true', () => {
    const { container } = render(<Seta estaAberto />);
    const icon = container.querySelector('i');
    expect(icon).toHaveClass('fa-chevron-down');
    expect(icon).not.toHaveClass('fa-chevron-right');
  });
});
