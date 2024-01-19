import { Form, FormItemProps, Input, InputProps } from 'antd';
import React from 'react';

type InputEmailProps = {
  inputProps: InputProps;
  formItemProps?: FormItemProps;
};

const InputEmail: React.FC<InputEmailProps> = ({ inputProps, formItemProps }) => {
  return (
    <Form.Item
      label="E-mail"
      name="email"
      rules={[{ required: true }, { type: 'email', message: 'Não é um e-mail válido' }]}
      {...formItemProps}
    >
      <Input
        placeholder="Informe o e-mail"
        autoComplete="off"
        maxLength={100}
        id="INPUT_EMAIL"
        {...inputProps}
      />
    </Form.Item>
  );
};

export default InputEmail;
