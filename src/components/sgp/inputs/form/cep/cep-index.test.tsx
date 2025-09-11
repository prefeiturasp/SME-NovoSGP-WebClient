// InputCEP.test.tsx

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import InputCEP from './index';

jest.mock('@/core/utils/functions', () => ({
  removerTudoQueNaoEhDigito: (v: string) => v.replace(/\D/g, ''),
}));
const mockObterDadosCEP = jest.fn();
jest.mock('@/core/services/endereco-service', () => ({
  __esModule: true,
  default: {
    obterDadosCEP: (...args: any[]) => mockObterDadosCEP(...args),
  },
}));

const mockSetFieldValue = jest.fn();
const mockValidateFields = jest.fn();
const mockGetFieldInstance = jest.fn(() => ({ focus: jest.fn() }));
jest.mock('antd', () => {
  const originalAntd = jest.requireActual('antd');
  return {
    ...originalAntd,
    Form: {
      ...originalAntd.Form,
      useFormInstance: () => ({
        setFieldValue: mockSetFieldValue,
        validateFields: mockValidateFields,
        getFieldInstance: mockGetFieldInstance,
      }),
      Item: ({ children, ...props }: any) => (
        <div data-testid="form-item" {...props}>
          {children}
        </div>
      ),
    },
    Input: (props: any) => <input data-testid="input" {...props} />,
  };
});

// Mock do axios HttpStatusCode
jest.mock('axios', () => ({
  HttpStatusCode: { NoContent: 204 },
}));

describe('InputCEP', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renderiza Form.Item e Input com props padrão', () => {
    render(<InputCEP inputProps={{}} />);
    const formItem = screen.getByTestId('form-item');
    const input = screen.getByTestId('input');

    expect(formItem).toBeInTheDocument();
    expect(formItem).toHaveAttribute('label', 'CEP');
    expect(formItem).toHaveAttribute('name', 'cep');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('placeholder', 'Informe o CEP');
    expect(input).toHaveAttribute('maxLength', '9');
  });

  it('passa as props extras para o Input', () => {
    render(<InputCEP inputProps={{ disabled: true, value: '12345678' }} />);
    const input = screen.getByTestId('input');
    expect(input).toHaveAttribute('disabled');
    expect(input).toHaveAttribute('value', '12345678');
  });

  it('passa as props extras para o Form.Item', () => {
    render(
      <InputCEP
        inputProps={{}}
        formItemProps={{ label: 'CEP Alternativo', name: 'cepAlt', required: false }}
      />,
    );
    const formItem = screen.getByTestId('form-item');
    expect(formItem).toHaveAttribute('label', 'CEP Alternativo');
    expect(formItem).toHaveAttribute('name', 'cepAlt');
  });

  it('chama getCEP ao digitar um CEP válido', async () => {
    mockObterDadosCEP.mockResolvedValue({
      data: {
        uf: 'sp',
        bairro: 'Centro',
        localidade: 'São Paulo',
        logradouro: 'Rua Teste',
        complemento: 'Apto 1',
      },
      status: 200,
    });

    render(<InputCEP inputProps={{}} />);
    const input = screen.getByTestId('input');

    fireEvent.change(input, { target: { value: '12345-678' } });

    // Como removerTudoQueNaoEhDigito retorna 12345678, getCEP será chamado
    await waitFor(() => {
      expect(mockObterDadosCEP).toHaveBeenCalledWith('12345678');
    });
  });
});
