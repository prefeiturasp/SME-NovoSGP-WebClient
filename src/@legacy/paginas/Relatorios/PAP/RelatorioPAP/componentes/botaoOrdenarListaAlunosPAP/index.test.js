import { render, fireEvent } from '@testing-library/react';
import BotaoOrdenarListaAlunosPAP from './index';

jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));
jest.mock('~/componentes-sgp', () => ({
  Ordenacao: ({ retornoOrdenado }) => (
    <button
      data-testid="ordenar"
      onClick={() => retornoOrdenado && retornoOrdenado(['aluno1', 'aluno2'])}
    >
      Ordenar
    </button>
  ),
}));
jest.mock('@/@legacy/redux/modulos/relatorioPAP/actions', () => ({
  setEstudantesRelatorioPAP: jest.fn(retorno => ({
    type: 'SET_ESTUDANTES',
    payload: retorno,
  })),
}));

import { useDispatch, useSelector } from 'react-redux';
import { setEstudantesRelatorioPAP } from '@/@legacy/redux/modulos/relatorioPAP/actions';

describe('BotaoOrdenarListaAlunosPAP', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renderiza o componente Ordenacao com os props corretos', () => {
    useSelector.mockImplementation(fn => ['a', 'b']);
    useDispatch.mockReturnValue(jest.fn());
    const { getByTestId } = render(<BotaoOrdenarListaAlunosPAP />);
    expect(getByTestId('ordenar')).toBeInTheDocument();
  });

  it('dispara o dispatch com setEstudantesRelatorioPAP ao ordenar', () => {
    const dispatch = jest.fn();
    useDispatch.mockReturnValue(dispatch);
    useSelector.mockImplementation(fn => ['a', 'b']);
    const { getByTestId } = render(<BotaoOrdenarListaAlunosPAP />);
    fireEvent.click(getByTestId('ordenar'));
    expect(setEstudantesRelatorioPAP).toHaveBeenCalledWith([
      'aluno1',
      'aluno2',
    ]);
    expect(dispatch).toHaveBeenCalledWith({
      type: 'SET_ESTUDANTES',
      payload: ['aluno1', 'aluno2'],
    });
  });

  it('passa estudantesRelatorioPAP corretamente para Ordenacao', () => {
    const estudantes = [{ nome: 'A' }, { nome: 'B' }];
    useSelector.mockImplementation(fn => estudantes);
    useDispatch.mockReturnValue(jest.fn());
    const { getByTestId } = render(<BotaoOrdenarListaAlunosPAP />);
    fireEvent.click(getByTestId('ordenar'));
    expect(setEstudantesRelatorioPAP).toHaveBeenCalledWith([
      'aluno1',
      'aluno2',
    ]);
  });
});
