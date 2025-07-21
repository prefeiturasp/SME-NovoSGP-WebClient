// SelectTipoReuniao.test.tsx

import { render, screen, waitFor } from '@testing-library/react';
import { SelectTipoReuniao, SelectTipoReuniaoFormItem } from './index';

// Mock do id de select
jest.mock('~/constantes/ids/select', () => ({
  SGP_SELECT_TIPO_REUNIAO: 'select-tipo-reuniao',
}));

// Mock do registroColetivoService
const mockObterTipoDeReuniaoNAAPA = jest.fn();
jest.mock('@/core/services/registro-coletivo-service', () => ({
  __esModule: true,
  default: {
    obterTipoDeReuniaoNAAPA: (...args: any[]) => mockObterTipoDeReuniaoNAAPA(...args),
  },
}));

// Mock do Select: serializa options em data-options
jest.mock('@/components/lib/inputs/select', () => (props: any) => (
  <div data-testid="select" data-options={JSON.stringify(props.options)} {...props} />
));
// Mock do Form.Item do antd
jest.mock('antd', () => {
  const originalAntd = jest.requireActual('antd');
  return {
    ...originalAntd,
    Form: {
      ...originalAntd.Form,
      Item: ({ children, ...props }: any) => (
        <div data-testid="form-item" {...props}>
          {children}
        </div>
      ),
    },
  };
});

describe('SelectTipoReuniao', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renderiza Select com opções retornadas do serviço', async () => {
    mockObterTipoDeReuniaoNAAPA.mockResolvedValue({
      sucesso: true,
      dados: [
        { titulo: 'Reunião Pedagógica', id: 1 },
        { titulo: 'Reunião de Pais', id: 2 },
      ],
    });

    render(<SelectTipoReuniao />);
    const select = await screen.findByTestId('select');

    await waitFor(() => {
      expect(mockObterTipoDeReuniaoNAAPA).toHaveBeenCalled();
      expect(select).toBeInTheDocument();
      expect(select.getAttribute('id')).toBe('select-tipo-reuniao');
      expect(select.getAttribute('placeholder')).toBe('Tipo de reunião');
      const options = JSON.parse(select.getAttribute('data-options')!);
      expect(options).toEqual([
        { label: 'Reunião Pedagógica', value: 1 },
        { label: 'Reunião de Pais', value: 2 },
      ]);
    });
  });

  it('renderiza Select com opções vazias se serviço falhar', async () => {
    mockObterTipoDeReuniaoNAAPA.mockResolvedValue({
      sucesso: false,
      dados: [],
    });

    render(<SelectTipoReuniao />);
    const select = await screen.findByTestId('select');

    await waitFor(() => {
      expect(mockObterTipoDeReuniaoNAAPA).toHaveBeenCalled();
      const options = JSON.parse(select.getAttribute('data-options')!);
      expect(options).toEqual([]);
    });
  });

  it('passa props extras para o Select', async () => {
    mockObterTipoDeReuniaoNAAPA.mockResolvedValue({
      sucesso: true,
      dados: [],
    });

    render(<SelectTipoReuniao value={2} disabled />);
    const select = await screen.findByTestId('select');

    await waitFor(() => {
      expect(select.getAttribute('disabled')).toBe('');
      expect(select.getAttribute('value')).toBe('2');
    });
  });
});

describe('SelectTipoReuniaoFormItem', () => {
  it('renderiza Form.Item com label e name corretos', () => {
    render(
      <SelectTipoReuniaoFormItem>
        <span data-testid="child">Filho</span>
      </SelectTipoReuniaoFormItem>,
    );
    const formItem = screen.getByTestId('form-item');
    expect(formItem).toBeInTheDocument();
    expect(formItem.getAttribute('label')).toBe('Tipo de reunião');
    expect(formItem.getAttribute('name')).toBe('tipoReuniaoId');
    expect(screen.getByTestId('child')).toBeInTheDocument();
  });

  it('passa props extras para o Form.Item', () => {
    render(
      <SelectTipoReuniaoFormItem label="Outro Tipo" name="outroTipo">
        <span />
      </SelectTipoReuniaoFormItem>,
    );
    const formItem = screen.getByTestId('form-item');
    expect(formItem.getAttribute('label')).toBe('Outro Tipo');
    expect(formItem.getAttribute('name')).toBe('outroTipo');
  });
});
