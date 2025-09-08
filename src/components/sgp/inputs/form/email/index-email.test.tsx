import { render, screen } from '@testing-library/react';
import InputEmail from './index';

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

describe('InputEmail', () => {
  it('renderiza o Form.Item e o Input com props padrão', () => {
    render(<InputEmail inputProps={{}} />);
    const formItem = screen.getByTestId('form-item');
    const input = screen.getByTestId('input');

    expect(formItem).toBeInTheDocument();
    expect(formItem).toHaveAttribute('label', 'E-mail');
    expect(formItem).toHaveAttribute('name', 'email');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('placeholder', 'Informe o e-mail');
    expect(input).toHaveAttribute('autoComplete', 'off');
    expect(input).toHaveAttribute('maxLength', '100');
    expect(input).toHaveAttribute('id', 'INPUT_EMAIL');
  });

  it('passa as props extras para o Input', () => {
    render(<InputEmail inputProps={{ disabled: true, value: 'teste@dominio.com' }} />);
    const input = screen.getByTestId('input');
    expect(input).toHaveAttribute('disabled');
    expect(input).toHaveAttribute('value', 'teste@dominio.com');
  });

  it('passa as props extras para o Form.Item', () => {
    render(
      <InputEmail
        inputProps={{}}
        formItemProps={{ label: 'Outro E-mail', name: 'outroEmail', required: false }}
      />,
    );
    const formItem = screen.getByTestId('form-item');
    expect(formItem).toHaveAttribute('label', 'Outro E-mail');
    expect(formItem).toHaveAttribute('name', 'outroEmail');
  });
});
