import React from 'react';
import { render, screen } from '@testing-library/react';
import { Form } from 'antd';
import useFormInstance from 'antd/es/form/hooks/useFormInstance';
import { useWatch } from 'antd/es/form/Form';
import { SelectBimestresFrequenciaProdutividade } from './index';

jest.mock('@/components/lib/inputs/select', () => (props: any) => (
  <select data-testid="mock-select" disabled={props.disabled}>
    {props.options?.map((opt: any) => (
      <option key={opt.value} value={opt.value}>
        {opt.label}
      </option>
    ))}
  </select>
));

jest.mock('antd/es/form/hooks/useFormInstance', () => {
  return {
    __esModule: true,
    default: jest.fn(),
  };
});

jest.mock('antd/es/form/Form', () => ({
  useWatch: jest.fn(),
}));

describe('SelectBimestresFrequenciaProdutividade', () => {
  const Wrapper: React.FC<{ initialValues?: any }> = ({ initialValues }) => {
    const [form] = Form.useForm();
    (useFormInstance as jest.Mock).mockReturnValue(form);
    (useWatch as jest.Mock).mockImplementation((name: string) => initialValues?.[name]);
    return (
      <Form form={form} initialValues={initialValues}>
        <SelectBimestresFrequenciaProdutividade />
      </Form>
    );
  };

  it('deve renderizar o select com todas as opções', () => {
    render(<Wrapper initialValues={{ ue: { value: 1 } }} />);
    const select = screen.getByTestId('mock-select');
    expect(select).toBeInTheDocument();
    expect(select).not.toBeDisabled();
    expect(select.querySelectorAll('option').length).toBe(5);
  });

  it('deve desabilitar o select quando ue não está definido', () => {
    render(<Wrapper initialValues={{ ue: undefined }} />);
    const select = screen.getByTestId('mock-select');
    expect(select).toBeDisabled();
  });

  it('deve desabilitar o select quando ue.value é falsy', () => {
    render(<Wrapper initialValues={{ ue: { value: 0 } }} />);
    const select = screen.getByTestId('mock-select');
    expect(select).toBeDisabled();
  });

  it('deve resetar o campo bimestre quando ue muda', () => {
    const setFieldValue = jest.fn();
    const TestWrapper: React.FC<{ ueValue: any }> = ({ ueValue }) => {
      const [form] = Form.useForm();
      form.setFieldValue = setFieldValue;
      (useFormInstance as jest.Mock).mockReturnValue(form);
      (useWatch as jest.Mock).mockImplementation((name: string) => {
        if (name === 'ue') return ueValue;
        return undefined;
      });
      return (
        <Form form={form} initialValues={{ ue: ueValue }}>
          <SelectBimestresFrequenciaProdutividade />
        </Form>
      );
    };
    const { rerender } = render(<TestWrapper ueValue={{ value: 1 }} />);
    rerender(<TestWrapper ueValue={{ value: 2 }} />);
    expect(setFieldValue).toHaveBeenCalledWith('bimestre', undefined);
  });
});
