import { render, screen } from '@testing-library/react';
import AuditoriaCadastroComunicados from './auditoriaCadastroComunicados';

jest.mock('~/componentes', () => ({
  Auditoria: jest.fn(props => (
    <div data-testid="auditoria-mock">{JSON.stringify(props)}</div>
  )),
}));

describe('AuditoriaCadastroComunicados', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('não renderiza Auditoria quando form é null', () => {
    // Passando um objeto com values vazio para evitar erro
    const { container } = render(
      <AuditoriaCadastroComunicados form={{ values: {} }} />
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('não renderiza Auditoria quando criadoEm não existe', () => {
    const form = { values: { criadoPor: 'User X' } }; // values existe, mas criadoEm não
    const { container } = render(<AuditoriaCadastroComunicados form={form} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renderiza Auditoria corretamente quando criadoEm existe', () => {
    const form = {
      values: {
        criadoEm: '2025-09-03T10:00:00Z',
        criadoPor: 'Usuário Teste',
        criadoRF: '12345',
        alteradoPor: 'Outro Usuário',
        alteradoEm: '2025-09-03T12:00:00Z',
        alteradoRF: '67890',
      },
    };

    render(<AuditoriaCadastroComunicados form={form} />);

    const auditoria = screen.getByTestId('auditoria-mock');
    expect(auditoria).toBeInTheDocument();

    const props = JSON.parse(auditoria.textContent);
    expect(props.criadoEm).toBe(form.values.criadoEm);
    expect(props.criadoPor).toBe(form.values.criadoPor);
    expect(props.criadoRf).toBe(form.values.criadoRF);
    expect(props.alteradoPor).toBe(form.values.alteradoPor);
    expect(props.alteradoEm).toBe(form.values.alteradoEm);
    expect(props.alteradoRf).toBe(form.values.alteradoRF);
    expect(props.ignorarMarginTop).toBe(true);
  });
});
