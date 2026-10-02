import { render, screen } from '@testing-library/react';
import TooltipEstudanteAusente from './tooltipEstudanteAusente';

jest.mock('antd', () => ({
  Tooltip: ({ title, children }) => (
    <div data-testid="tooltip" title={title}>
      {children}
    </div>
  ),
}));

describe('TooltipEstudanteAusente', () => {
  it('renderiza ícone de estudante ausente', () => {
    const { container } = render(<TooltipEstudanteAusente />);
    const icon = container.querySelector('.fa-user-times');
    expect(icon).toBeInTheDocument();
  });

  it('exibe tooltip com texto correto', () => {
    render(<TooltipEstudanteAusente />);
    expect(screen.getByTestId('tooltip')).toHaveAttribute(
      'title',
      'Estudante ausente na data da avaliação'
    );
  });
});
