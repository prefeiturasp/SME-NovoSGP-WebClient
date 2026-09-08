import { render, screen } from '@testing-library/react';
import { HistoricoItem } from './historico-item';

jest.mock('./styles', () => ({
  Container: ({ children }) => <div data-testid="container">{children}</div>,
}));

describe('HistoricoItem', () => {
  it('renderiza vazio quando historico é undefined', () => {
    const { container } = render(<HistoricoItem />);
    expect(container.querySelector('[data-testid="container"]')).toBeInTheDocument();
    expect(container.textContent).toBe('');
  });

  it('renderiza descrição', () => {
    render(<HistoricoItem historico={{ descricao: 'Alteração de nota' }} />);
    expect(screen.getByText('Alteração de nota')).toBeInTheDocument();
  });

  it('renderiza seção quando presente', () => {
    render(
      <HistoricoItem
        historico={{ descricao: 'Desc', secao: 'Frequência' }}
      />
    );
    expect(screen.getByText(/Seção: Frequência/)).toBeInTheDocument();
  });

  it('renderiza campos inseridos quando presente', () => {
    render(
      <HistoricoItem
        historico={{ descricao: 'Desc', camposInseridos: 'Nota, Conceito' }}
      />
    );
    expect(
      screen.getByText(/Campos inseridos: Nota, Conceito/)
    ).toBeInTheDocument();
  });

  it('renderiza campos alterados quando presente', () => {
    render(
      <HistoricoItem
        historico={{ descricao: 'Desc', camposAlterados: 'Parecer' }}
      />
    );
    expect(
      screen.getByText(/Campos alterados: Parecer/)
    ).toBeInTheDocument();
  });

  it('não renderiza seção quando ausente', () => {
    render(<HistoricoItem historico={{ descricao: 'Desc' }} />);
    expect(screen.queryByText(/Seção:/)).not.toBeInTheDocument();
  });
});
