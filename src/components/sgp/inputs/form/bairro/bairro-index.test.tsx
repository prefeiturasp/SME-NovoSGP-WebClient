// InputBairro.test.tsx

import { render, screen } from '@testing-library/react';
import InputBairro from './index';

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

describe('InputBairro', () => {
  it('renderiza Form.Item e Input com props padrão', () => {
    render(<InputBairro inputProps={{}} />);
    const formItem = screen.getByTestId('form-item');
    const input = screen.getByTestId('input');

    expect(formItem).toBeInTheDocument();
    expect(formItem).toHaveAttribute('label', 'Bairro');
    expect(formItem).toHaveAttribute('name', 'bairro');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('placeholder', 'Informe o bairro');
    expect(input).toHaveAttribute('id', 'INPUT_BAIRRO');
    expect(input).toHaveAttribute('maxLength', '200');
  });

  it('passa as props extras para o Input', () => {
    render(<InputBairro inputProps={{ disabled: true, value: 'Centro' }} />);
    const input = screen.getByTestId('input');
    expect(input).toHaveAttribute('disabled');
    expect(input).toHaveAttribute('value', 'Centro');
  });

  it('passa as props extras para o Form.Item', () => {
    render(
      <InputBairro
        inputProps={{}}
        formItemProps={{ label: 'Outro Bairro', name: 'outroBairro', required: false }}
      />,
    );
    const formItem = screen.getByTestId('form-item');
    expect(formItem).toHaveAttribute('label', 'Outro Bairro');
    expect(formItem).toHaveAttribute('name', 'outroBairro');
  });
});
