import { render, screen } from '@testing-library/react';

import { useAppSelector } from '@/core/hooks/use-redux';
import BuscaAtivaRegistroAcoesAuditoria from './auditoria';

jest.mock('~/componentes', () => ({
  Auditoria: (props: any) => <div>Mocked Auditoria - criado em: {props.criadoEm}</div>,
}));

jest.mock('@/core/hooks/use-redux', () => ({
  useAppSelector: jest.fn(),
}));

describe('BuscaAtivaRegistroAcoesAuditoria', () => {
  it('mostra Auditoria se criadoEm existir', () => {
    (useAppSelector as jest.Mock).mockReturnValue({
      auditoria: {
        criadoEm: '2025-01-01T00:00:00Z',
        criadoPor: 'João',
      },
    });

    render(<BuscaAtivaRegistroAcoesAuditoria />);

    expect(screen.getByText(/Mocked Auditoria/)).toBeInTheDocument();
    expect(screen.getByText(/criado em: 2025-01-01T00:00:00Z/)).toBeInTheDocument();
  });

  it('não mostra Auditoria se criadoEm estiver faltando', () => {
    (useAppSelector as jest.Mock).mockReturnValue({
      auditoria: {
        criadoPor: 'João',
        // criadoEm faltando
      },
    });

    const { container } = render(<BuscaAtivaRegistroAcoesAuditoria />);
    expect(container).toBeEmptyDOMElement();
  });
});
