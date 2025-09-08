// InputTelefone.test.tsx

import { render, screen } from '@testing-library/react';
import InputTelefone from './index';

jest.mock('@/core/utils/functions', () => ({
  maskTelefone: jest.fn((v) => `masked:${v}`),
}));

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

describe('InputTelefone', () => {
  it('renderiza Form.Item e Input com props padrão', () => {
    render(<InputTelefone inputProps={{}} />);
    const formItem = screen.getByTestId('form-item');
    const input = screen.getByTestId('input');

    expect(formItem).toBeInTheDocument();
    expect(formItem.getAttribute('label')).toBe('Telefone');
    expect(formItem.getAttribute('name')).toBe('telefone');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('placeholder', '(XX) XXXXX-XXXX');
    expect(input).toHaveAttribute('maxLength', '15');
  });

  it('passa as props extras para o Input', () => {
    render(<InputTelefone inputProps={{ disabled: true, value: '123' }} />);
    const input = screen.getByTestId('input');
    expect(input).toHaveAttribute('disabled');
    expect(input).toHaveAttribute('value', '123');
  });

  it('passa as props extras para o Form.Item', () => {
    render(
      <InputTelefone
        inputProps={{}}
        formItemProps={{ label: 'Celular', name: 'celular', required: false }}
      />,
    );
    const formItem = screen.getByTestId('form-item');
    expect(formItem.getAttribute('label')).toBe('Celular');
    expect(formItem.getAttribute('name')).toBe('celular');
  });
});
