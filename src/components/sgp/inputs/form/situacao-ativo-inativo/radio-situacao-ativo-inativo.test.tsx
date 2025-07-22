// RadioSituacaoAtivoInativo.test.tsx

import { render, screen } from '@testing-library/react';
import RadioSituacaoAtivoInativo from './radio-situacao-ativo-inativo';

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
    Radio: {
      ...originalAntd.Radio,
      Group: (props: any) => (
        <div
          data-testid="radio-group"
          data-disabled={props.disabled}
          data-value={props.value}
          data-default-value={props.defaultValue}
        >
          {props.options &&
            props.options.map((opt: any, idx: number) => (
              <span key={idx} data-testid="radio-option">
                {opt.label}
              </span>
            ))}
        </div>
      ),
    },
  };
});

describe('RadioSituacaoAtivoInativo', () => {
  it('renderiza Form.Item e Radio.Group com opções padrão', () => {
    render(<RadioSituacaoAtivoInativo />);
    const formItem = screen.getByTestId('form-item');
    const radioGroup = screen.getByTestId('radio-group');
    const options = screen.getAllByTestId('radio-option');

    expect(formItem).toBeInTheDocument();
    expect(formItem.getAttribute('label')).toBe('Situação');
    expect(formItem.getAttribute('name')).toBe('situacao');
    expect(formItem.getAttribute('valuePropName')).toBe('value');

    expect(radioGroup).toBeInTheDocument();
    expect(radioGroup.getAttribute('data-default-value')).toBe('true');

    expect(options.length).toBe(2);
    expect(options[0]).toHaveTextContent('Ativo');
    expect(options[1]).toHaveTextContent('Inativo');
  });

  it('passa props extras para o Radio.Group', () => {
    render(<RadioSituacaoAtivoInativo radioGroupProps={{ disabled: true, value: false }} />);
    const radioGroup = screen.getByTestId('radio-group');
    expect(radioGroup.getAttribute('data-disabled')).toBe('true');
    expect(radioGroup.getAttribute('data-value')).toBe('false');
  });

  it('passa props extras para o Form.Item', () => {
    render(
      <RadioSituacaoAtivoInativo
        formItemProps={{ label: 'Status', name: 'status', required: false }}
      />,
    );
    const formItem = screen.getByTestId('form-item');
    expect(formItem.getAttribute('label')).toBe('Status');
    expect(formItem.getAttribute('name')).toBe('status');
  });
});
