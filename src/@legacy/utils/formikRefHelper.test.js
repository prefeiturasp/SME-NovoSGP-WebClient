import { formularioEhValido, validarFormik } from './formikRefHelper';

describe('formikRefHelper', () => {
  it('deve aceitar formulários sem validateForm quando o contexto Formik estiver disponível', async () => {
    const form = {
      getFormikContext: () => ({ isValid: true, errors: {} }),
    };

    await expect(validarFormik(form)).resolves.toBeUndefined();
    expect(formularioEhValido(form)).toBe(true);
  });
});
