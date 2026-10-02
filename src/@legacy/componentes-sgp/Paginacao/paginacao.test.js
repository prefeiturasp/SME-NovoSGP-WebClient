import { render, fireEvent } from '@testing-library/react';
import Paginacao from './paginacao';

jest.mock('antd', () => ({
  Pagination: props => (
    <div>
      <span data-testid="total">{props.total}</span>
      <span data-testid="page-size">{props.pageSize}</span>
      <button
        data-testid="change-page"
        onClick={() => props.onChange(2, props.pageSize)}
      >
        next
      </button>
      <button
        data-testid="change-size"
        onClick={() => props.onShowSizeChange(1, 20)}
      >
        size
      </button>
    </div>
  ),
}));

describe('Paginacao', () => {
  it('renderiza total e pageSize iniciais', () => {
    const { getByTestId } = render(
      <Paginacao numeroRegistros={50} pageSize={10} />
    );
    expect(getByTestId('total').textContent).toBe('50');
    expect(getByTestId('page-size').textContent).toBe('10');
  });

  it('chama onChangePaginacao ao mudar de página', () => {
    const onChangePaginacao = jest.fn();
    const { getByTestId } = render(
      <Paginacao numeroRegistros={50} onChangePaginacao={onChangePaginacao} />
    );
    fireEvent.click(getByTestId('change-page'));
    expect(onChangePaginacao).toHaveBeenCalledWith(2, 10);
  });

  it('chama onChangeNumeroLinhas ao mudar o tamanho', () => {
    const onChangeNumeroLinhas = jest.fn();
    const { getByTestId } = render(
      <Paginacao
        numeroRegistros={50}
        onChangeNumeroLinhas={onChangeNumeroLinhas}
      />
    );
    fireEvent.click(getByTestId('change-size'));
    expect(onChangeNumeroLinhas).toHaveBeenCalledWith(1, 20);
  });

  it('reseta estado quando resetInitialState=true', () => {
    const setResetInitialState = jest.fn();
    render(
      <Paginacao
        numeroRegistros={50}
        resetInitialState
        setResetInitialState={setResetInitialState}
      />
    );
    expect(setResetInitialState).toHaveBeenCalledWith(false);
  });
});
