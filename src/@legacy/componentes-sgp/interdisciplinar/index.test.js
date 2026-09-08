import { render, screen } from '@testing-library/react';
import LabelInterdisciplinar from './index';

jest.mock('antd', () => ({
  Tooltip: ({ children, title }) => (
    <div data-testid="tooltip">
      {children}
      <div data-testid="tooltip-title">{title}</div>
    </div>
  ),
}));

describe('LabelInterdisciplinar', () => {
  it('renderiza o texto Interdisciplinar', () => {
    render(<LabelInterdisciplinar />);
    expect(screen.getByText('Interdisciplinar')).toBeInTheDocument();
  });

  it('lista disciplinas no tooltip', () => {
    render(<LabelInterdisciplinar disciplinas={['Matemática', 'Ciências']} />);
    expect(screen.getByText('Matemática')).toBeInTheDocument();
    expect(screen.getByText('Ciências')).toBeInTheDocument();
  });
});
