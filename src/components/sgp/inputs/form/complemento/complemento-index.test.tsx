// InputComplemento.test.tsx

import { render, screen } from '@testing-library/react';
import InputComplemento from './index';

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

describe('InputComplemento', () => {
  it('renderiza Form.Item e Input com props padrão', () => {
    render(<InputComplemento inputProps={{}} />);
    const formItem = screen.getByTestId('form-item');
    const input = screen.getByTestId('input');

    expect(formItem).toBeInTheDocument();
    expect(formItem).toHaveAttribute('label', 'Complemento');
    expect(formItem).toHaveAttribute('name', 'complemento');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('placeholder', 'Informe o complemento');
    expect(input).toHaveAttribute('id', 'INPUT_COMPLEMENTO');
    expect(input).toHaveAttribute('maxLength', '20');
  });

  it('passa as props extras para o Input', () => {
    render(<InputComplemento inputProps={{ disabled: true, value: 'Apto 101' }} />);
    const input = screen.getByTestId('input');
    expect(input).toHaveAttribute('disabled');
    expect(input).toHaveAttribute('value', 'Apto 101');
  });

  it('passa as props extras para o Form.Item', () => {
    render(
      <InputComplemento
        inputProps={{}}
        formItemProps={{ label: 'Outro', name: 'outro', required: false }}
      />,
    );
    const formItem = screen.getByTestId('form-item');
    expect(formItem).toHaveAttribute('label', 'Outro');
    expect(formItem).toHaveAttribute('name', 'outro');
  });
});
