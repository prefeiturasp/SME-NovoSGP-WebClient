// CheckboxExibirHistorico.test.tsx

import { render, screen } from '@testing-library/react';
import CheckboxExibirHistorico from './index';

jest.mock('~/constantes/ids/checkbox', () => ({
  SGP_CHECKBOX_EXIBIR_HISTORICO: 'checkbox-exibir-historico',
}));

jest.mock('antd', () => {
  const originalAntd = jest.requireActual('antd');
  return {
    ...originalAntd,
    Checkbox: ({ children, ...props }: any) => (
      <label>
        <input type="checkbox" data-testid="checkbox" {...props} />
        {children}
      </label>
    ),
    Typography: {
      Text: (props: any) => (
        <span data-testid="typography-text" {...props}>
          {props.children}
        </span>
      ),
    },
    Form: {
      ...originalAntd.Form,
      Item: ({ children, ...props }: any) => (
        <div data-testid="form-item" {...props}>
          {children}
        </div>
      ),
    },
  };
});

describe('CheckboxExibirHistorico', () => {
  it('passa as props extras para o Checkbox', () => {
    render(<CheckboxExibirHistorico checkboxProps={{ disabled: true, checked: true }} />);
    const checkbox = screen.getByTestId('checkbox');
    expect(checkbox).toHaveAttribute('disabled');
    expect(checkbox).toHaveAttribute('checked');
  });

  it('passa as props extras para o Form.Item', () => {
    render(<CheckboxExibirHistorico formItemProps={{ name: 'historico', required: false }} />);
    const formItem = screen.getByTestId('form-item');
    expect(formItem).toHaveAttribute('name', 'historico');
  });
});
