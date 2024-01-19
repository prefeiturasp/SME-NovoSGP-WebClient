import { Form, FormItemProps, Input, InputProps } from 'antd';
import React from 'react';

type InputComplementoProps = {
  inputProps: InputProps;
  formItemProps?: FormItemProps;
};

const InputComplemento: React.FC<InputComplementoProps> = ({ inputProps, formItemProps }) => {
  return (
    <Form.Item label="Complemento" name="complemento" {...formItemProps}>
      <Input
        placeholder="Informe o complemento"
        id="INPUT_COMPLEMENTO"
        maxLength={20}
        {...inputProps}
      />
    </Form.Item>
  );
};

export default InputComplemento;
