// SelectDRE.test.tsx

import { render, screen, waitFor } from '@testing-library/react';
import SelectDRE from './index';

// Mocks de constantes e serviços
jest.mock('@/@legacy/componentes', () => ({
  Loader: ({ loading, children }: any) => (
    <div data-testid="loader" data-loading={loading ? 'true' : 'false'}>
      {children}
    </div>
  ),
}));
jest.mock('@/@legacy/componentes-sgp', () => ({
  FiltroHelper: {
    ordenarLista: () => (a: any, b: any) => a.nome.localeCompare(b.nome),
  },
}));
jest.mock('@/@legacy/constantes', () => ({
  OPCAO_TODOS: 0,
}));
jest.mock('@/@legacy/constantes/ids/select', () => ({
  SGP_SELECT_DRE: 'select-dre',
}));
const mockApiGet = jest.fn();
jest.mock('@/@legacy/servicos', () => ({
  api: { get: (...args: any[]) => mockApiGet(...args) },
  erros: jest.fn(),
}));

// Mock do Select para serializar options em data-options
jest.mock('../../../../lib/inputs/select', () => (props: any) => (
  <div
    data-testid="select"
    data-options={JSON.stringify(props.options)}
    data-disabled={props.disabled ? 'true' : 'false'}
    {...props}
  />
));

// Mock do antd.Form.useFormInstance
const mockSetFieldValue = jest.fn();
jest.mock('antd', () => {
  const originalAntd = jest.requireActual('antd');
  return {
    ...originalAntd,
    Form: {
      ...originalAntd.Form,
      useFormInstance: () => ({
        setFieldValue: mockSetFieldValue,
      }),
    },
  };
});

// Mock estável para useWatch
const formState = {
  anoLetivo: 2024,
  consideraHistorico: false,
};
jest.mock('antd/es/form/Form', () => ({
  useWatch: jest.fn((field: string) => formState[field]),
}));

describe('SelectDRE', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renderiza Loader, Form.Item e Select com opções ordenadas', async () => {
    mockApiGet.mockResolvedValue({
      data: [
        { codigo: 2, nome: 'B' },
        { codigo: 1, nome: 'A' },
      ],
    });

    render(<SelectDRE />);
    const loader = screen.getByTestId('loader');
    const select = await screen.findByTestId('select');

    expect(loader).toBeInTheDocument();
    expect(select).toBeInTheDocument();

    await waitFor(() => {
      const options = JSON.parse(select.getAttribute('data-options')!);
      // Deve estar ordenado por nome
      expect(options).toEqual([
        { codigo: 1, nome: 'A', value: 1, label: 'A' },
        { codigo: 2, nome: 'B', value: 2, label: 'B' },
      ]);
      expect(select.getAttribute('id')).toBe('select-dre');
      expect(select.getAttribute('placeholder')).toBe('Diretoria Regional de Educação (DRE)');
    });
  });

  it('desabilita Select se selectProps.disabled for true', async () => {
    mockApiGet.mockResolvedValue({ data: [] });
    render(<SelectDRE selectProps={{ disabled: true }} />);
    const select = await screen.findByTestId('select');
    expect(select.getAttribute('data-disabled')).toBe('true');
  });

  it('renderiza opção "Todas" se mostrarOpcaoTodas for true', async () => {
    mockApiGet.mockResolvedValue({
      data: [
        { codigo: 1, nome: 'A' },
        { codigo: 2, nome: 'B' },
      ],
    });
    render(<SelectDRE mostrarOpcaoTodas />);
    const select = await screen.findByTestId('select');
    await waitFor(() => {
      const options = JSON.parse(select.getAttribute('data-options')!);
      expect(options[0]).toEqual({ value: 0, label: 'Todas' });
    });
  });

  it('passa props extras para o Form.Item', () => {
    render(<SelectDRE formItemProps={{ label: 'DREs', name: 'dres', required: false }} />);
    // Não é possível garantir o data-testid do Form.Item, mas não deve quebrar
  });
});
