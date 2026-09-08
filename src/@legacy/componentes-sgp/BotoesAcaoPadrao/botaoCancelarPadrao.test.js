import { render, fireEvent } from '@testing-library/react';
import BotaoCancelarPadrao from './botaoCancelarPadrao';

jest.mock('~/componentes/button', () => props => {
  const { border, bold, semMargemDireita, ...rest } = props;
  return (
    <button data-testid="btn" {...rest}>
      {props.label}
    </button>
  );
});
jest.mock('~/componentes/colors', () => ({ Colors: { Roxo: 'purple' } }));

describe('BotaoCancelarPadrao', () => {
  it('renderiza com label Cancelar', () => {
    const { getByTestId } = render(<BotaoCancelarPadrao />);
    expect(getByTestId('btn').textContent).toBe('Cancelar');
  });

  it('chama onClick ao clicar', () => {
    const onClick = jest.fn();
    const { getByTestId } = render(<BotaoCancelarPadrao onClick={onClick} />);
    fireEvent.click(getByTestId('btn'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('fica desabilitado quando disabled=true', () => {
    const { getByTestId } = render(<BotaoCancelarPadrao disabled />);
    expect(getByTestId('btn')).toBeDisabled();
  });

  it('fica habilitado por padrão', () => {
    const { getByTestId } = render(<BotaoCancelarPadrao />);
    expect(getByTestId('btn')).not.toBeDisabled();
  });
});
