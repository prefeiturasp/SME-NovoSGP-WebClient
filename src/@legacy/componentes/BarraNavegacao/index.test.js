import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import BarraNavegacao from './index';

const mockOnChangeItem = jest.fn();

const itens = [
  { id: 1, descricao: 'Item 1' },
  { id: 2, descricao: 'Item 2' },
  { id: 3, descricao: 'Item 3' },
];

describe('BarraNavegacao', () => {
  it('deve renderizar corretamente', () => {
    render(
      <BarraNavegacao
        itens={itens}
        itemAtivo={itens[0]}
        onChangeItem={mockOnChangeItem}
      />
    );

    expect(screen.getByText('Anterior')).toBeInTheDocument();
    expect(screen.getByText('Próximo')).toBeInTheDocument();

    const itemElements = screen.getAllByRole('button');
    expect(itemElements).toHaveLength(5); // Deve haver 3 itens de navegação + 2 botões
  });

  it('deve chamar onChangeItem quando um item de navegação é clicado', () => {
    render(
      <BarraNavegacao
        itens={itens}
        itemAtivo={itens[0]}
        onChangeItem={mockOnChangeItem}
      />
    );

    const item2 = screen
      .getAllByRole('button')
      .filter(button => button.classList.contains('itemNavegacao'))[1]; // Segundo item
    fireEvent.click(item2);

    expect(mockOnChangeItem).toHaveBeenCalledWith(itens[1]);
  });

  it('deve desabilitar o botão "Anterior" quando o primeiro item for ativo', () => {
    render(
      <BarraNavegacao
        itens={itens}
        itemAtivo={itens[0]}
        onChangeItem={mockOnChangeItem}
      />
    );

    const anteriorBtn = screen.getByText('Anterior');
    expect(anteriorBtn).toBeDisabled();
  });

  it('deve desabilitar o botão "Próximo" quando o último item for ativo', () => {
    render(
      <BarraNavegacao
        itens={itens}
        itemAtivo={itens[2]}
        onChangeItem={mockOnChangeItem}
      />
    );

    const proximoBtn = screen.getByText('Próximo');
    expect(proximoBtn).toBeDisabled();
  });

  it('deve mostrar "Sem dados" quando não houver itens', () => {
    render(
      <BarraNavegacao
        itens={[]}
        itemAtivo={{}}
        onChangeItem={mockOnChangeItem}
      />
    );

    expect(screen.getByText('Sem dados')).toBeInTheDocument();
  });
});
