import { render, screen } from '@testing-library/react';
import LabelAusenteCellTable from './index';

jest.mock('antd', () => ({
  Tooltip: ({ title, children }) => (
    <div data-testid="tooltip" title={title}>
      {children}
    </div>
  ),
}));

describe('LabelAusenteCellTable', () => {
  it('renderiza ícone de estudante ausente', () => {
    const { container } = render(<LabelAusenteCellTable />);
    expect(container.querySelector('.fa-user-times')).toBeInTheDocument();
  });

  it('exibe tooltip com texto correto', () => {
    render(<LabelAusenteCellTable />);
    expect(screen.getByTestId('tooltip')).toHaveAttribute(
      'title',
      'Estudante ausente na data da avaliação'
    );
  });
});
