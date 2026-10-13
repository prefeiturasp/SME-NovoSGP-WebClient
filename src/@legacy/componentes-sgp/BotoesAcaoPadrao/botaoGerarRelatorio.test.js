import { render, fireEvent } from '@testing-library/react';
import BotaoGerarRelatorio from './botaoGerarRelatorio';

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
      gerar
    </button>
  );
});
jest.mock('~/componentes/loader', () => ({ children, loading }) => (
  <div data-testid="loader" data-loading={loading}>
    {children}
  </div>
));
jest.mock('~/componentes/colors', () => ({ Colors: { Azul: 'blue' } }));

describe('BotaoGerarRelatorio', () => {
  it('usa título padrão Gerar', () => {
    const { getByTestId } = render(<BotaoGerarRelatorio />);
    expect(getByTestId('tooltip')).toHaveAttribute('title', 'Gerar');
  });

  it('chama onClick e desabilita o botão', () => {
    const onClick = jest.fn();
    const { getByTestId, rerender } = render(
      <BotaoGerarRelatorio onClick={onClick} />
    );
    fireEvent.click(getByTestId('btn'));
    expect(onClick).toHaveBeenCalledTimes(1);

    rerender(<BotaoGerarRelatorio disabled />);
    expect(getByTestId('btn')).toBeDisabled();
  });

  it('envolve o botão com Loader quando showLoader=true', () => {
    const { getByTestId } = render(
      <BotaoGerarRelatorio showLoader loading />
    );
    expect(getByTestId('loader')).toHaveAttribute('data-loading', 'true');
    expect(getByTestId('btn')).toBeInTheDocument();
  });
});
