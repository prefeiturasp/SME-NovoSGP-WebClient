import { render, fireEvent } from '@testing-library/react';
import BotaoExcluirPadrao from './botaoExcluirPadrao';

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
      excluir
    </button>
  );
});
jest.mock('~/componentes/colors', () => ({ Colors: { Vermelho: 'red' } }));

describe('BotaoExcluirPadrao', () => {
  it('renderiza tooltip Excluir', () => {
    const { getByTestId } = render(<BotaoExcluirPadrao />);
    expect(getByTestId('tooltip')).toHaveAttribute('title', 'Excluir');
  });

  it('chama onClick e respeita disabled', () => {
    const onClick = jest.fn();
    const { getByTestId, rerender } = render(
      <BotaoExcluirPadrao onClick={onClick} />
    );
    fireEvent.click(getByTestId('btn'));
    expect(onClick).toHaveBeenCalledTimes(1);

    rerender(<BotaoExcluirPadrao disabled />);
    expect(getByTestId('btn')).toBeDisabled();
  });
});
