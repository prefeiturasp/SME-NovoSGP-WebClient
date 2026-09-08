import { render, screen } from '@testing-library/react';
import { TagDataUltimaConsolidacao } from './index';

jest.mock('antd', () => ({
  Tag: ({ children }: any) => (
    <span data-testid="tag">{children}</span>
  ),
}));
jest.mock('~/componentes', () => ({
  Base: { Roxo: '#8C588C', Branco: '#FFF' },
}));

describe('TagDataUltimaConsolidacao', () => {
  it('não renderiza quando data é vazia', () => {
    const { container } = render(<TagDataUltimaConsolidacao data="" />);
    expect(container.querySelector('[data-testid="tag"]')).toBeNull();
  });

  it('renderiza tag com data formatada', () => {
    render(<TagDataUltimaConsolidacao data="2024-06-15T14:30:00" />);
    expect(screen.getByTestId('tag').textContent).toContain('15/06/2024');
    expect(screen.getByTestId('tag').textContent).toContain('14:30');
  });

  it('usa título padrão', () => {
    render(<TagDataUltimaConsolidacao data="2024-01-01T10:00:00" />);
    expect(screen.getByTestId('tag').textContent).toContain(
      'Data da última atualização:'
    );
  });

  it('aceita título customizado', () => {
    render(
      <TagDataUltimaConsolidacao
        data="2024-01-01T10:00:00"
        titulo="Atualizado em:"
      />
    );
    expect(screen.getByTestId('tag').textContent).toContain('Atualizado em:');
  });
});
