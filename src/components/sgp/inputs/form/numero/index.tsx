import { Form, FormItemProps, Input, InputProps } from 'antd';
import React from 'react';

type InputNumeroProps = {
  inputProps: InputProps;
  formItemProps?: FormItemProps;
};

const InputNumero: React.FC<InputNumeroProps> = ({ inputProps, formItemProps }) => {
  return (
    <Form.Item
      label="Número"
      name="numero"
      rules={[{ required: true }]}
      getValueFromEvent={(e: React.ChangeEvent<HTMLInputElement>) =>
        `${e?.target?.value}`.replace(/\D/g, '')
      }
      {...formItemProps}
    >
      <Input placeholder="Informe o nº" id="INPUT_NUMERO" maxLength={9} {...inputProps} />
    </Form.Item>
  );
};

export default InputNumero;
