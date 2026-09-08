import { render, fireEvent } from '@testing-library/react';
import BotaoSalvarPadrao from './botaoSalvarPadrao';

jest.mock('~/componentes/button', () => props => {
  const { border, bold, semMargemDireita, ...rest } = props;
  return (
    <button data-testid="btn" {...rest}>
      {props.label}
    </button>
  );
});
jest.mock('~/componentes/colors', () => ({ Colors: { Roxo: 'purple' } }));

describe('BotaoSalvarPadrao', () => {
  it('renderiza com label Salvar', () => {
    const { getByTestId } = render(<BotaoSalvarPadrao />);
    expect(getByTestId('btn').textContent).toBe('Salvar');
  });

  it('chama onClick ao clicar', () => {
    const onClick = jest.fn();
    const { getByTestId } = render(<BotaoSalvarPadrao onClick={onClick} />);
    fireEvent.click(getByTestId('btn'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('fica desabilitado quando disabled=true', () => {
    const { getByTestId } = render(<BotaoSalvarPadrao disabled />);
    expect(getByTestId('btn')).toBeDisabled();
  });
});
