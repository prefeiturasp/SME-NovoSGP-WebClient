import { render, screen, fireEvent } from '@testing-library/react';
import ButtonSecundary from './index';

describe('ButtonSecundary', () => {
  it('renderiza com o texto correto', () => {
    render(<ButtonSecundary>Secundário</ButtonSecundary>);
    expect(screen.getByRole('button', { name: /secundário/i })).toBeInTheDocument();
  });

  it('dispara onClick quando clicado', () => {
    const onClick = jest.fn();
    render(<ButtonSecundary onClick={onClick}>Clique aqui</ButtonSecundary>);
    fireEvent.click(screen.getByRole('button', { name: /clique aqui/i }));
    expect(onClick).toHaveBeenCalled();
  });

  it('aplica cor customizada quando passada via prop', () => {
    render(<ButtonSecundary color="red">Colorido</ButtonSecundary>);
    const btn = screen.getByRole('button', { name: /colorido/i });
    expect(btn).toHaveStyle('color: red');
  });
});
