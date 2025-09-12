// SelectUE.test.tsx

import { render, screen, waitFor } from '@testing-library/react';
import SelectUE from './index';

// Mocks de constantes e serviços
jest.mock('@/@legacy/componentes', () => ({
  Loader: ({ loading, children }: any) => (
    <div data-testid="loader" data-loading={loading ? 'true' : 'false'}>
      {children}
    </div>
  ),
}));
jest.mock('@/@legacy/constantes', () => ({
  OPCAO_TODOS: 0,
}));
jest.mock('@/@legacy/constantes/ids/select', () => ({
  SGP_SELECT_UE: 'select-ue',
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

// Mock do antd Form.Item e useFormInstance
const mockSetFieldValue = jest.fn();
jest.mock('antd', () => {
  const originalAntd = jest.requireActual('antd');
  return {
    ...originalAntd,
    Form: {
      ...originalAntd.Form,
      useFormInstance: () => ({
        setFieldValue: mockSetFieldValue,
        isFieldsTouched: () => false, // sempre false para evitar loop
      }),
      Item: ({ children, ...props }: any) => (
        <div data-testid="form-item" {...props}>
          {children}
        </div>
      ),
    },
  };
});

// Mock estável para useWatch
const formState = {
  anoLetivo: 2024,
  dre: { value: 123 },
  consideraHistorico: false,
};
jest.mock('antd/es/form/Form', () => ({
  useWatch: (field: string) => formState[field],
}));

describe('SelectUE', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renderiza Loader, Form.Item e Select', async () => {
    mockApiGet.mockResolvedValue({
      data: [
        { codigo: 1, nome: 'UE 1' },
        { codigo: 2, nome: 'UE 2' },
      ],
    });

    render(<SelectUE />);
    const loader = screen.getByTestId('loader');
    const formItem = screen.getByTestId('form-item');
    const select = await screen.findByTestId('select');

    expect(loader).toBeInTheDocument();
    expect(formItem).toBeInTheDocument();
    expect(select).toBeInTheDocument();

    await waitFor(() => {
      const options = JSON.parse(select.getAttribute('data-options')!);
      expect(options).toEqual([
        { codigo: 1, nome: 'UE 1', value: 1, label: 'UE 1' },
        { codigo: 2, nome: 'UE 2', value: 2, label: 'UE 2' },
      ]);
      expect(select.getAttribute('id')).toBe('select-ue');
      expect(select.getAttribute('placeholder')).toBe('Unidade Escolar (UE)');
    });
  });

  it('desabilita Select se selectProps.disabled for true', async () => {
    mockApiGet.mockResolvedValue({ data: [] });
    render(<SelectUE selectProps={{ disabled: true }} />);
    const select = await screen.findByTestId('select');
    expect(select.getAttribute('data-disabled')).toBe('true');
  });

  it('passa props extras para o Form.Item', () => {
    render(<SelectUE formItemProps={{ label: 'Unidades', name: 'ues', required: false }} />);
    const formItem = screen.getByTestId('form-item');
    expect(formItem.getAttribute('label')).toBe('Unidades');
    expect(formItem.getAttribute('name')).toBe('ues');
  });
});
