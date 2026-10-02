import { render, screen } from '@testing-library/react';
import TooltipStatusGsa from './tooltipStatusGsa';

jest.mock('antd', () => ({
  Tooltip: ({ title, children }) => (
    <div data-testid="tooltip" title={title}>
      {children}
    </div>
  ),
}));
jest.mock('@fortawesome/react-fontawesome', () => ({
  FontAwesomeIcon: props => <span data-testid="icon" style={props.style} />,
}));
jest.mock('@fortawesome/free-solid-svg-icons', () => ({
  faCheck: 'faCheck',
}));

describe('TooltipStatusGsa', () => {
  it('renderiza o ícone', () => {
    render(<TooltipStatusGsa />);
    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });

  it('exibe tooltip com texto correto', () => {
    render(<TooltipStatusGsa />);
    expect(screen.getByTestId('tooltip')).toHaveAttribute(
      'title',
      'Atividade entregue no Google Sala de Aula'
    );
  });
});
