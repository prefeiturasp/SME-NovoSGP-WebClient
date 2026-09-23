import { render, fireEvent } from '@testing-library/react';
import BotaoVoltarPadrao from './botaoVoltarPadrao';

jest.mock('antd', () => ({
  Tooltip: ({ children, title }) => (
    <div data-testid="tooltip" title={title}>
      {children}
    </div>
  ),
}));
jest.mock('~/componentes/button', () => props => {
  const { border, semMargemDireita, ...rest } = props;
  return (
    <button data-testid="btn" {...rest}>
      voltar
    </button>
  );
});
jest.mock('~/componentes/colors', () => ({ Colors: { Azul: 'blue' } }));

describe('BotaoVoltarPadrao', () => {
  it('renderiza tooltip Voltar', () => {
    const { getByTestId } = render(<BotaoVoltarPadrao />);
    expect(getByTestId('tooltip')).toHaveAttribute('title', 'Voltar');
  });

  it('chama onClick ao clicar', () => {
    const onClick = jest.fn();
    const { getByTestId } = render(<BotaoVoltarPadrao onClick={onClick} />);
    fireEvent.click(getByTestId('btn'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
