import { Form, FormItemProps, Input, InputProps } from 'antd';
import React from 'react';

type InputCidadeProps = {
  inputProps: InputProps;
  formItemProps?: FormItemProps;
};

const InputCidade: React.FC<InputCidadeProps> = ({ inputProps, formItemProps }) => {
  return (
    <Form.Item label="Cidade" name="cidade" rules={[{ required: true }]} {...formItemProps}>
      <Input placeholder="Informe a cidade" id="INPUT_CIDADE" maxLength={50} {...inputProps} />
    </Form.Item>
  );
};

export default InputCidade;
