import { render, screen } from '@testing-library/react';
import moment from 'moment';
import { Auditoria } from './index';

beforeAll(() => {
  (window as any).moment = moment;
});

describe('Auditoria', () => {
  it('não renderiza nada se created e altered são vazios', () => {
    const props = {
      id: '1',
      criadoPor: '',
      criadoEm: '',
      criadoRF: '',
      alteradoPor: '',
      alteradoEm: '',
      alteradoRF: '',
    };
    const { container } = render(<Auditoria {...props} />);
    expect(container.firstChild).toBeNull();
  });

  it('exibe INSERIDO quando criadoPor é informado', () => {
    const props = {
      id: '1',
      criadoPor: 'user1',
      criadoEm: '2025-06-05T08:15:00Z',
      criadoRF: '',
      alteradoPor: '',
      alteradoEm: '',
      alteradoRF: '',
    };
    render(<Auditoria {...props} />);
    expect(screen.getByText(/INSERIDO por user1 em 05\/06\/2025 às 08:15/)).toBeInTheDocument();
    expect(screen.queryByText(/ALTERADO por/)).toBeNull();
  });

  it('inclui criadoRF quando diferente de "0"', () => {
    const props = {
      id: '1',
      criadoPor: 'user1',
      criadoEm: '2025-06-05T08:15:00Z',
      criadoRF: 'RF123',
      alteradoPor: '',
      alteradoEm: '',
      alteradoRF: '',
    };
    render(<Auditoria {...props} />);
    expect(screen.getByText(/\(RF123\)/)).toBeInTheDocument();
  });

  it('não mostra criadoRF quando for "0"', () => {
    const props = {
      id: '1',
      criadoPor: 'user1',
      criadoEm: '2025-06-05T08:15:00Z',
      criadoRF: '0',
      alteradoPor: '',
      alteradoEm: '',
      alteradoRF: '',
    };
    render(<Auditoria {...props} />);
    expect(screen.queryByText(/\(0\)/)).toBeNull();
  });

  it('exibe ALTERADO quando alteradoPor é informado', () => {
    const props = {
      id: '1',
      criadoPor: '',
      criadoEm: '',
      criadoRF: '',
      alteradoPor: 'user2',
      alteradoEm: '2025-06-06T12:00:00Z',
      alteradoRF: '',
    };
    render(<Auditoria {...props} />);
    expect(screen.getByText(/ALTERADO por/)).toBeInTheDocument();
    expect(screen.getByText(/user2/)).toBeInTheDocument();
    expect(screen.getByText(/06\/06\/2025/)).toBeInTheDocument();
    expect(screen.getByText(/às 12:00/)).toBeInTheDocument();
    expect(screen.queryByText(/INSERIDO por/)).toBeNull();
  });

  it('inclui alteradoRF quando diferente de "0"', () => {
    const props = {
      id: '1',
      criadoPor: '',
      criadoEm: '',
      criadoRF: '',
      alteradoPor: 'user2',
      alteradoEm: '2025-06-06T12:00:00Z',
      alteradoRF: 'RF456',
    };
    render(<Auditoria {...props} />);
    expect(screen.getByText(/\(RF456\)/)).toBeInTheDocument();
  });

  it('exibe ambos INSERIDO e ALTERADO quando os dois são informados', () => {
    const props = {
      id: '1',
      criadoPor: 'user1',
      criadoEm: '2025-06-05T08:15:00Z',
      criadoRF: 'RF1',
      alteradoPor: 'user2',
      alteradoEm: '2025-06-06T12:00:00Z',
      alteradoRF: 'RF2',
    };
    render(<Auditoria {...props} />);
    expect(screen.getByText(/INSERIDO por/)).toBeInTheDocument();
    expect(screen.getByText(/user1/)).toBeInTheDocument();
    expect(screen.getByText(/\(RF1\)/)).toBeInTheDocument();
    expect(screen.getByText(/05\/06\/2025/)).toBeInTheDocument();
    expect(screen.getByText(/às 08:15/)).toBeInTheDocument();

    expect(screen.getByText(/ALTERADO por/)).toBeInTheDocument();
    expect(screen.getByText(/user2/)).toBeInTheDocument();
    expect(screen.getByText(/\(RF2\)/)).toBeInTheDocument();
    expect(screen.getByText(/06\/06\/2025/)).toBeInTheDocument();
    expect(screen.getByText(/às 12:00/)).toBeInTheDocument();
  });
});
