import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ListaPaginada from './listaPaginada';

jest.mock('~/servicos', () => ({
  api: {
    get: jest.fn(() =>
      Promise.resolve({
        status: 200,
        data: {
          totalRegistros: 2,
          items: [
            { id: 1, nome: 'Item 1' },
            { id: 2, nome: 'Item 2' },
          ],
        },
      })
    ),
  },
  erros: jest.fn(),
}));

describe('Componente ListaPaginada', () => {
  const props = {
    url: '/api/dados',
    colunas: [{ title: 'Nome', dataIndex: 'nome', key: 'nome' }],
    filtro: {},
    colunaChave: 'id',
    filtroEhValido: true,
    temPaginacao: true,
    setLista: jest.fn(),
    onClick: jest.fn(),
  };

  test('Deve renderizar o componente com colunas e sem dados iniciais', () => {
    render(<ListaPaginada {...props} />);
    screen.debug();
    expect(screen.getByText('Sem dados')).toBeInTheDocument();
  });

  test('Deve chamar a API e renderizar os dados corretamente', async () => {
    render(<ListaPaginada {...props} />);
    await waitFor(() => expect(screen.getByText('Item 1')).toBeInTheDocument());
    expect(screen.getByText('Item 2')).toBeInTheDocument();
  });

  test('Deve chamar a função onClick ao clicar em uma linha', async () => {
    render(<ListaPaginada {...props} />);
    await waitFor(() => expect(screen.getByText('Item 1')).toBeInTheDocument());
    const linha = screen.getByText('Item 1');
    fireEvent.click(linha);
    expect(props.onClick).toHaveBeenCalledWith(
      { id: 1, nome: 'Item 1' },
      expect.anything()
    );
  });

  test('Deve lidar com a seleção de linhas', async () => {
    const selecionarItems = jest.fn();
    render(<ListaPaginada {...props} selecionarItems={selecionarItems} />);
    await waitFor(() => expect(screen.getByText('Item 1')).toBeInTheDocument());

    const checkbox = screen.getAllByRole('checkbox')[1];
    fireEvent.click(checkbox);
    expect(selecionarItems).toHaveBeenCalledWith([{ id: 1, nome: 'Item 1' }]);
  });
});
