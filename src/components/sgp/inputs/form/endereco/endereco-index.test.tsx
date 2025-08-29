// InputEndereco.test.tsx

import { render, screen } from '@testing-library/react';
import InputEndereco from './index';

// Mock dos componentes do antd
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
    Input: (props: any) => <input data-testid="input" {...props} />,
  };
});

describe('InputEndereco', () => {
  it('renderiza o Form.Item e o Input com props padrão', () => {
    render(<InputEndereco inputProps={{}} />);
    const formItem = screen.getByTestId('form-item');
    const input = screen.getByTestId('input');

    expect(formItem).toBeInTheDocument();
    expect(formItem).toHaveAttribute('label', 'Endereço');
    expect(formItem).toHaveAttribute('name', 'endereco');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('placeholder', 'Informe a rua/avenida');
    expect(input).toHaveAttribute('maxLength', '200');
    expect(input).toHaveAttribute('id', 'INPUT_ENDERECO');
  });

  it('passa as props extras para o Input', () => {
    render(<InputEndereco inputProps={{ disabled: true, value: 'Rua das Flores' }} />);
    const input = screen.getByTestId('input');
    expect(input).toHaveAttribute('disabled');
    expect(input).toHaveAttribute('value', 'Rua das Flores');
  });

  it('passa as props extras para o Form.Item', () => {
    render(
      <InputEndereco
        inputProps={{}}
        formItemProps={{ label: 'Rua', name: 'rua', required: false }}
      />,
    );
    const formItem = screen.getByTestId('form-item');
    expect(formItem).toHaveAttribute('label', 'Rua');
    expect(formItem).toHaveAttribute('name', 'rua');
  });
});
