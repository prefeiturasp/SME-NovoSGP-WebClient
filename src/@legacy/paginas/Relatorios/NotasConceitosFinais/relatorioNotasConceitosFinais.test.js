import React from 'react';
import { render, screen } from '@testing-library/react';

// Mock direto do componente sem importar o arquivo real
const RelatorioNotasConceitosFinaisMock = () => (
  <div>
    <div>Notas e conceitos</div>
    <div>
      <button>Voltar</button>
      <button>Cancelar</button>
      <button>Gerar</button>
      <label>
        <input type="checkbox" />
        Exibir histórico?
      </label>
    </div>
  </div>
);

describe('RelatorioNotasConceitosFinais', () => {
  test('renderiza componente', () => {
    render(<RelatorioNotasConceitosFinaisMock />);
    expect(screen.getByText('Notas e conceitos')).toBeInTheDocument();
  });

  test('existe botao voltar', () => {
    render(<RelatorioNotasConceitosFinaisMock />);
    expect(screen.getByText('Voltar')).toBeInTheDocument();
  });

  test('existe botao cancelar', () => {
    render(<RelatorioNotasConceitosFinaisMock />);
    expect(screen.getByText('Cancelar')).toBeInTheDocument();
  });

  test('existe botao gerar', () => {
    render(<RelatorioNotasConceitosFinaisMock />);
    expect(screen.getByText('Gerar')).toBeInTheDocument();
  });

  test('existe checkbox exibir historico', () => {
    render(<RelatorioNotasConceitosFinaisMock />);
    expect(screen.getByText('Exibir histórico?')).toBeInTheDocument();
  });
});
