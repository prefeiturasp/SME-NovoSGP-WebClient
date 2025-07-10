// InputNumero.test.tsx

import { render, screen } from '@testing-library/react';
import InputNumero from './index';

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

describe('InputNumero', () => {
  it('renderiza Form.Item e Input com props padrão', () => {
    render(<InputNumero inputProps={{}} />);
    const formItem = screen.getByTestId('form-item');
    const input = screen.getByTestId('input');

    expect(formItem).toBeInTheDocument();
    expect(formItem).toHaveAttribute('label', 'Número');
    expect(formItem).toHaveAttribute('name', 'numero');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('placeholder', 'Informe o nº');
    expect(input).toHaveAttribute('id', 'INPUT_NUMERO');
    expect(input).toHaveAttribute('maxLength', '9');
  });

  it('passa as props extras para o Input', () => {
    render(<InputNumero inputProps={{ disabled: true, value: '123' }} />);
    const input = screen.getByTestId('input');
    expect(input).toHaveAttribute('disabled');
    expect(input).toHaveAttribute('value', '123');
  });

  it('passa as props extras para o Form.Item', () => {
    render(
      <InputNumero
        inputProps={{}}
        formItemProps={{ label: 'Nº', name: 'numeroEndereco', required: false }}
      />,
    );
    const formItem = screen.getByTestId('form-item');
    expect(formItem).toHaveAttribute('label', 'Nº');
    expect(formItem).toHaveAttribute('name', 'numeroEndereco');
  });
});
