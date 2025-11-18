import { Form, FormItemProps, Input, InputProps } from 'antd';
import React from 'react';

type InputEnderecoProps = {
  inputProps: InputProps;
  formItemProps?: FormItemProps;
};

const InputEndereco: React.FC<InputEnderecoProps> = ({ inputProps, formItemProps }) => {
  return (
    <Form.Item label="Endereço" name="endereco" rules={[{ required: true }]} {...formItemProps}>
      <Input
        placeholder="Informe a rua/avenida"
        maxLength={200}
        id="INPUT_ENDERECO"
        {...inputProps}
      />
    </Form.Item>
  );
};

export default InputEndereco;
