import { render } from '@testing-library/react';
import Painel from './painel';

jest.mock('shortid', () => ({ generate: () => 'id-mock' }));

const mockPanel = jest.fn(({ header, children, ...props }) => (
  <div data-testid="panel" {...props}>
    <div data-testid="header">{header}</div>
    <div data-testid="children">{children}</div>
  </div>
));

jest.mock('antd', () => ({
  Collapse: { Panel: props => mockPanel(props) },
}));

describe('Painel', () => {
  beforeEach(() => mockPanel.mockClear());

  it('renderiza com título e children', () => {
    const { getByTestId } = render(
      <Painel titulo="Meu Título">
        <span>Conteúdo</span>
      </Painel>
    );
    expect(getByTestId('header').textContent).toBe('Meu Título');
    expect(getByTestId('children').textContent).toBe('Conteúdo');
    expect(mockPanel).toHaveBeenCalledWith(
      expect.objectContaining({
        header: 'Meu Título',
        children: expect.anything(),
      })
    );
  });

  it('usa defaultProps quando não recebe props', () => {
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const { getByTestId } = render(<Painel />);
    expect(getByTestId('header').textContent).toBe('');
    expect(getByTestId('children').textContent).toBe('');
    spy.mockRestore();
  });
});
