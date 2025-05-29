import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ButtonPrimary from './index';

describe('ButtonPrimary', () => {
  it('renderiza com o texto correto', () => {
    render(<ButtonPrimary>Primário</ButtonPrimary>);
    expect(screen.getByRole('button', { name: /primário/i })).toBeInTheDocument();
  });

  it('dispara onClick quando clicado', () => {
    const onClick = jest.fn();
    render(<ButtonPrimary onClick={onClick}>Clique aqui</ButtonPrimary>);
    fireEvent.click(screen.getByRole('button', { name: /clique aqui/i }));
    expect(onClick).toHaveBeenCalled();
  });

  it('aplica o estilo fontWeight 700', () => {
    render(<ButtonPrimary>Estilo</ButtonPrimary>);
    const btn = screen.getByRole('button', { name: /estilo/i });
    expect(btn).toHaveStyle('font-weight: 700');
  });
});
