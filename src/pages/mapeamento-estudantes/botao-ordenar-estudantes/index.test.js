import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BotaoOrdenarMapeamentoEstudantes } from './index';
import { useAppDispatch, useAppSelector } from '@/core/hooks/use-redux';
import { setEstudantesMapeamentoEstudantes } from '~/redux/modulos/mapeamentoEstudantes/actions';

jest.mock('@/core/hooks/use-redux');
jest.mock('~/redux/modulos/mapeamentoEstudantes/actions', () => ({
  setEstudantesMapeamentoEstudantes: jest.fn(),
}));

const mockDispatch = jest.fn();
const estudantesMock = [
  { id: 1, nome: 'Aluno 1', numeroChamada: 2 },
  { id: 2, nome: 'Aluno 2', numeroChamada: 1 },
];

jest.mock('~/componentes-sgp', () => ({
  Ordenacao: ({ conteudoParaOrdenar, retornoOrdenado }) => (
    <button
      onClick={() =>
        retornoOrdenado([conteudoParaOrdenar[1], conteudoParaOrdenar[0]])
      }
    >
      Ordenar
    </button>
  ),
}));

describe('BotaoOrdenarMapeamentoEstudantes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useAppDispatch.mockReturnValue(mockDispatch);
    useAppSelector.mockImplementation(fn =>
      fn({
        mapeamentoEstudantes: {
          estudantesMapeamentoEstudantes: estudantesMock,
        },
      })
    );
  });

  it('renderiza o botão de ordenação', () => {
    render(<BotaoOrdenarMapeamentoEstudantes />);
    expect(screen.getByText('Ordenar')).toBeInTheDocument();
  });

  it('chama o dispatch com a action correta ao ordenar', () => {
    render(<BotaoOrdenarMapeamentoEstudantes />);
    fireEvent.click(screen.getByText('Ordenar'));
    expect(setEstudantesMapeamentoEstudantes).toHaveBeenCalledWith([
      estudantesMock[1],
      estudantesMock[0],
    ]);
    expect(mockDispatch).toHaveBeenCalled();
  });
});
