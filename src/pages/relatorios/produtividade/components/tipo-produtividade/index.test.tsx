import React, { createContext } from 'react';
import { render, screen } from '@testing-library/react';
import { Form } from 'antd';
import useFormInstance from 'antd/es/form/hooks/useFormInstance';

import { SelectTipoRelatorioFrequenciaProdutividade } from './index';

jest.mock('@/components/lib/inputs/select', () => (props: any) => (
  <select data-testid="mock-select" {...props} />
));

const FormContext = createContext<any>(null);

jest.mock('antd/es/form/hooks/useFormInstance', () => {
  return {
    __esModule: true,
    default: jest.fn(),
  };
});

describe('SelectTipoRelatorioFrequenciaProdutividade', () => {
  const Wrapper: React.FC<{ initialValues: any }> = ({ initialValues }) => {
    const [form] = Form.useForm();
    (useFormInstance as jest.Mock).mockReturnValue(form);
    return (
      <FormContext.Provider value={form}>
        <Form form={form} initialValues={initialValues}>
          <SelectTipoRelatorioFrequenciaProdutividade />
        </Form>
      </FormContext.Provider>
    );
  };

  it('deve renderizar o select habilitado quando ue está definido', () => {
    render(<Wrapper initialValues={{ ue: { value: 1 } }} />);
    const select = screen.getByTestId('mock-select');

    expect(select).toBeInTheDocument();
  });

  it('deve renderizar o select desabilitado quando ue não está definido', () => {
    render(<Wrapper initialValues={{ ue: undefined }} />);
    const select = screen.getByTestId('mock-select');
    expect(select).toBeDisabled();
  });

  it('deve desabilitar a opção Analítico quando ue é OPCAO_TODOS', () => {
    render(<Wrapper initialValues={{ ue: { value: -99 } }} />);
    const select = screen.getByTestId('mock-select');
    expect(select).toBeInTheDocument();
  });
});
