import { render, screen } from '@testing-library/react';
import InputCidade from './index';

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

describe('InputCidade', () => {
  it('renderiza Form.Item e Input com props padrão', () => {
    render(<InputCidade inputProps={{}} />);
    const formItem = screen.getByTestId('form-item');
    const input = screen.getByTestId('input');

    expect(formItem).toBeInTheDocument();
    expect(formItem).toHaveAttribute('label', 'Cidade');
    expect(formItem).toHaveAttribute('name', 'cidade');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('placeholder', 'Informe a cidade');
    expect(input).toHaveAttribute('id', 'INPUT_CIDADE');
    expect(input).toHaveAttribute('maxLength', '50');
  });

  it('passa props extras para o Input', () => {
    render(<InputCidade inputProps={{ disabled: true, value: 'São Paulo' }} />);
    const input = screen.getByTestId('input');
    expect(input).toHaveAttribute('disabled');
    expect(input).toHaveAttribute('value', 'São Paulo');
  });

  it('passa props extras para o Form.Item', () => {
    render(
      <InputCidade
        inputProps={{}}
        formItemProps={{ label: 'Outra Cidade', name: 'outraCidade' }}
      />
    );
    const formItem = screen.getByTestId('form-item');
    expect(formItem).toHaveAttribute('label', 'Outra Cidade');
    expect(formItem).toHaveAttribute('name', 'outraCidade');
  });
});
