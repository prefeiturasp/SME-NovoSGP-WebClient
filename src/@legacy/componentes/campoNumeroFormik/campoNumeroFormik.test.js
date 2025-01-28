import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CampoNumeroFormik from './campoNumeroFormik';
import { Formik, Field } from 'formik';

const renderWithFormik = (
  component,
  initialValues = { campoNumero: 0 },
  errors = {},
  touched = {}
) => {
  return render(
    <Formik
      initialValues={initialValues}
      onSubmit={() => {}}
      validate={() => {}}
      validateOnBlur
    >
      {({
        errors: formErrors,
        touched: formTouched,
        setFieldValue,
        setFieldTouched,
      }) => (
        <>
          {React.cloneElement(component, {
            form: {
              errors: { ...formErrors, ...errors },
              touched: { ...formTouched, ...touched },
              setFieldValue,
              setFieldTouched,
            },
          })}
        </>
      )}
    </Formik>
  );
};

describe('CampoNumeroFormik', () => {
  test('deve renderizar corretamente', () => {
    renderWithFormik(
      <CampoNumeroFormik name="campoNumero" label="Campo Número" />
    );
    expect(screen.getByText('Campo Número')).toBeInTheDocument();
  });

  test('deve chamar onChange ao atualizar o valor', () => {
    const onChange = jest.fn();
    renderWithFormik(
      <CampoNumeroFormik
        name="campoNumero"
        label="Campo Número"
        onChange={onChange}
      />
    );

    const input = screen.getByRole('spinbutton');
    fireEvent.change(input, { target: { value: '10' } });

    expect(onChange).toHaveBeenCalledWith(10);
  });

  test('deve exibir erro quando houver erro de validação', async () => {
    renderWithFormik(
      <CampoNumeroFormik name="campoNumero" label="Campo Número" />,
      { campoNumero: 0 },
      { campoNumero: 'Campo inválido' },
      { campoNumero: true }
    );

    await waitFor(() =>
      expect(screen.getByText('Campo inválido')).toBeInTheDocument()
    );
  });

  test('deve aplicar a classe is-invalid quando houver erro', async () => {
    renderWithFormik(
      <CampoNumeroFormik name="campoNumero" label="Campo Número" />,
      { campoNumero: 0 },
      { campoNumero: 'Campo inválido' },
      { campoNumero: true }
    );

    await waitFor(() => {
      const inputNumberContainer =
        screen.getByRole('spinbutton').parentNode.parentNode;
      expect(inputNumberContainer).toHaveClass('is-invalid');
    });
  });

  test('deve ser desabilitado quando o campo disabled for verdadeiro', () => {
    renderWithFormik(
      <CampoNumeroFormik name="campoNumero" label="Campo Número" disabled />
    );

    expect(screen.getByRole('spinbutton')).toBeDisabled();
  });
});
