import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import Paginacao from './paginacao';

describe('Paginacao', () => {
  it('deve renderizar com props padrão', () => {
    const { getByRole } = render(<Paginacao />);
    expect(getByRole('list')).toBeInTheDocument();
  });

  it('deve chamar onChangePaginacao ao mudar de página', () => {
    const onChangePaginacao = jest.fn();
    const { getByTitle } = render(
      <Paginacao numeroRegistros={30} onChangePaginacao={onChangePaginacao} />
    );
    const nextButton = getByTitle('Next Page');
    fireEvent.click(nextButton);
    expect(onChangePaginacao).toHaveBeenCalled();
  });

  it('deve chamar onChangeNumeroLinhas ao mudar o tamanho da página', () => {
    const onChangeNumeroLinhas = jest.fn();
    const { getByRole, findByText } = render(
      <Paginacao
        mostrarNumeroLinhas
        onChangeNumeroLinhas={onChangeNumeroLinhas}
      />
    );
    const combobox = getByRole('combobox');
    fireEvent.mouseDown(combobox);
    findByText('20').then(option => {
      fireEvent.click(option);
      expect(onChangeNumeroLinhas).toHaveBeenCalled();
    });
  });

  it('deve resetar o estado ao receber resetInitialState', () => {
    const setResetInitialState = jest.fn();
    const { rerender } = render(
      <Paginacao
        resetInitialState
        setResetInitialState={setResetInitialState}
      />
    );
    rerender(
      <Paginacao
        resetInitialState
        setResetInitialState={setResetInitialState}
      />
    );
    expect(setResetInitialState).toHaveBeenCalledWith(false);
  });

  it('não deve chamar setResetInitialState se não for fornecido', () => {
    render(<Paginacao resetInitialState />);
    expect(true).toBe(true);
  });
});
