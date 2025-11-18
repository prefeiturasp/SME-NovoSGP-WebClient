/* eslint-disable no-template-curly-in-string */
import { FormProps } from 'antd/es/form/Form';

export const validateMessages: FormProps['validateMessages'] = {
  required: 'Campo obrigatório',
  whitespace: 'Campo obrigatório',
  string: {
    range: 'Deve ter entre ${min} e ${max} caracteres',
    min: 'Deve conter no mínimo ${min} caracteres',
  },
  types: {
    email: 'Por favor, Informe um e-mail válido',
  },
};
