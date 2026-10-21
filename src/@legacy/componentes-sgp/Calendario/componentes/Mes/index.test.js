import { render, fireEvent } from '@testing-library/react';
import Mes from './index';

jest.mock('./styles', () => ({
  DivWrapperMes: ({ children, className }) => (
    <div data-testid="wrapper" className={className}>
      {children}
    </div>
  ),
  DivMes: ({ children, onClick, ...rest }) => (
    <div data-testid="mes" onClick={onClick} {...rest}>
      {children}
    </div>
  ),
}));

describe('Mes', () => {
  it('exibe o nome do mês', () => {
    const { getByText } = render(
      <Mes mes={{ nome: 'Março', estaAberto: false }} />
    );
    expect(getByText('Março')).toBeInTheDocument();
  });

  it('aplica classe aberto quando estaAberto=true', () => {
    const { getByTestId } = render(
      <Mes mes={{ nome: 'Março', estaAberto: true }} />
    );
    expect(getByTestId('wrapper')).toHaveClass('aberto');
  });

  it('chama onClickMes quando há tipoCalendarioId', () => {
    const onClickMes = jest.fn();
    const mes = { nome: 'Março', estaAberto: false };
    const { getByTestId } = render(
      <Mes mes={mes} tipoCalendarioId="1" onClickMes={onClickMes} />
    );
    fireEvent.click(getByTestId('mes'));
    expect(onClickMes).toHaveBeenCalledWith(mes);
  });

  it('não chama onClickMes sem tipoCalendarioId', () => {
    const onClickMes = jest.fn();
    const { getByTestId } = render(
      <Mes mes={{ nome: 'Março' }} onClickMes={onClickMes} />
    );
    fireEvent.click(getByTestId('mes'));
    expect(onClickMes).not.toHaveBeenCalled();
  });
});
