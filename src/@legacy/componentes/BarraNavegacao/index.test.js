import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import BarraNavegacao from './index';

// Mock do onChangeItem
const mockOnChangeItem = jest.fn();

// Dados de exemplo para os itens
const itens = [
    { id: 1, descricao: 'Item 1' },
    { id: 2, descricao: 'Item 2' },
    { id: 3, descricao: 'Item 3' },
];

describe('BarraNavegacao', () => {

    it('deve renderizar corretamente', () => {
        render(<BarraNavegacao itens={itens} itemAtivo={itens[0]} onChangeItem={mockOnChangeItem} />);

        // Verifique se os botões "Anterior" e "Próximo" estão na tela
        expect(screen.getByText('Anterior')).toBeInTheDocument();
        expect(screen.getByText('Próximo')).toBeInTheDocument();

        // Verifique se os itens de navegação estão sendo renderizados
        const itemElements = screen.getAllByRole('button');
        expect(itemElements).toHaveLength(5); // Deve haver 3 itens de navegação + 2 botões

        // Verificar se os textos de cada item estão presentes
        // itens.forEach((item, index) => {
        //     expect(itemElements[index].textContent).toContain(item.descricao);
        // });
    });


    it('deve chamar onChangeItem quando um item de navegação é clicado', () => {
        render(<BarraNavegacao itens={itens} itemAtivo={itens[0]} onChangeItem={mockOnChangeItem} />);

        // Clicar no segundo item de navegação (Item 2)
        const item2 = screen.getAllByRole('button').filter(button => button.classList.contains('itemNavegacao'))[1]; // Segundo item
        fireEvent.click(item2);

        // Verifique se o mock de onChangeItem foi chamado com o item correto (Item 2)
        expect(mockOnChangeItem).toHaveBeenCalledWith(itens[1]);
    });

    it('deve desabilitar o botão "Anterior" quando o primeiro item for ativo', () => {
        render(<BarraNavegacao itens={itens} itemAtivo={itens[0]} onChangeItem={mockOnChangeItem} />);

        const anteriorBtn = screen.getByText('Anterior');
        expect(anteriorBtn).toBeDisabled();
    });

    it('deve desabilitar o botão "Próximo" quando o último item for ativo', () => {
        render(<BarraNavegacao itens={itens} itemAtivo={itens[2]} onChangeItem={mockOnChangeItem} />);

        const proximoBtn = screen.getByText('Próximo');
        expect(proximoBtn).toBeDisabled();
    });

    it('deve mostrar "Sem dados" quando não houver itens', () => {
        render(<BarraNavegacao itens={[]} itemAtivo={{}} onChangeItem={mockOnChangeItem} />);

        expect(screen.getByText('Sem dados')).toBeInTheDocument();
    });
});
