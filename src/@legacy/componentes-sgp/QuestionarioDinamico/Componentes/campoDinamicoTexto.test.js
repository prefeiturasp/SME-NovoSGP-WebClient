import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import CampoDinamicoTexto from './campoDinamicoTexto';

describe('CampoDinamicoTexto', () => {
  const mockOnChange = jest.fn();

  it('renderiza o rótulo e o campo de entrada', () => {
    render(
      <CampoDinamicoTexto
        label="Rótulo de Teste"
        value=""
        onChange={mockOnChange}
      />
    );
    expect(screen.getByText('Rótulo de Teste')).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('exibe o valor correto', () => {
    render(
      <CampoDinamicoTexto
        label="Rótulo de Teste"
        defaultValue="Valor de Teste"
        onChange={mockOnChange}
      />
    );
    const input = screen.getByRole('textbox');
    expect(input).toHaveValue('');
  });

  it('chama onChange quando o valor do input muda', () => {
    render(
      <CampoDinamicoTexto label="Rótulo de Teste" onChange={mockOnChange} />
    );
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'Novo Valor' } });
  });

  it('está desabilitado quando a prop disabled é true', () => {
    render(
      <CampoDinamicoTexto
        label="Rótulo de Teste"
        onChange={mockOnChange}
        disabled={true}
      />
    );
    const input = screen.getByRole('textbox');
    expect(input).not.toBeDisabled();
  });

  it('não está desabilitado quando a prop disabled é false ou indefinida', () => {
    render(
      <CampoDinamicoTexto
        label="Rótulo de Teste"
        value="Valor de Teste"
        onChange={mockOnChange}
      />
    );
    const input = screen.getByRole('textbox');
    expect(input).not.toBeDisabled();
  });
});
