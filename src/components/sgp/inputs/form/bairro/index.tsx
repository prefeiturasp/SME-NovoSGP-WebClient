import { Form, FormItemProps, Input, InputProps } from 'antd';
import React from 'react';

type InputBairroProps = {
  inputProps: InputProps;
  formItemProps?: FormItemProps;
};

const InputBairro: React.FC<InputBairroProps> = ({ inputProps, formItemProps }) => {
  return (
    <Form.Item label="Bairro" name="bairro" rules={[{ required: true }]} {...formItemProps}>
      <Input placeholder="Informe o bairro" id="INPUT_BAIRRO" maxLength={200} {...inputProps} />
    </Form.Item>
  );
};

export default InputBairro;
