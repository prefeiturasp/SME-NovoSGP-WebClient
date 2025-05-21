import React from 'react';
import { render } from '@testing-library/react';
import { Form } from 'antd';
import useFormInstance from 'antd/es/form/hooks/useFormInstance';
import { LocalizadorProfessorRelProdutividade } from './index';

jest.mock('@/components/sgp/inputs/form/localizador-professor', () => ({
  LocalizadorProfessor: (props: any) => <div data-testid="mock-localizador-professor" {...props} />,
}));

jest.mock('antd/es/form/hooks/useFormInstance', () => {
  return {
    __esModule: true,
    default: jest.fn(),
  };
});

describe('LocalizadorProfessorRelProdutividade', () => {
  const Wrapper: React.FC<{ initialValues: any }> = ({ initialValues }) => {
    const [form] = Form.useForm();
    (useFormInstance as jest.Mock).mockReturnValue(form);
    return (
      <Form form={form} initialValues={initialValues}>
        <LocalizadorProfessorRelProdutividade />
      </Form>
    );
  };

  it('deve habilitar o LocalizadorProfessor quando tipoRelatorioProdutividade for Analitico', () => {
    render(<Wrapper initialValues={{ tipoRelatorioProdutividade: 2 }} />); // 2 = Analitico
    const localizador = document.querySelector('[data-testid="mock-localizador-professor"]');
    expect(localizador).toBeInTheDocument();
  });

  it('deve habilitar o LocalizadorProfessor quando tipoRelatorioProdutividade for MediaPorProfessor', () => {
    render(<Wrapper initialValues={{ tipoRelatorioProdutividade: 1 }} />); // 1 = MediaPorProfessor
    const localizador = document.querySelector('[data-testid="mock-localizador-professor"]');
    expect(localizador).toBeInTheDocument();
  });

  it('deve desabilitar o LocalizadorProfessor quando tipoRelatorioProdutividade for MediaPorUE', () => {
    render(<Wrapper initialValues={{ tipoRelatorioProdutividade: 0 }} />); // 0 = MediaPorUE
    const localizador = document.querySelector('[data-testid="mock-localizador-professor"]');
    expect(localizador).toBeInTheDocument();
  });
});
