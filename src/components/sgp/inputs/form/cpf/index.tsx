import { removerTudoQueNaoEhDigito } from '@/core/utils/functions';
import { Form, FormItemProps, Input, InputProps } from 'antd';
import React from 'react';
type InputCPFProps = {
  inputProps: InputProps;
  formItemProps?: FormItemProps;
};

const InputCPF: React.FC<InputCPFProps> = ({ inputProps, formItemProps }) => {
  const formatterCPFMask = (value: string | number | undefined) =>
    `${value}`
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1');

  const getValueFromEvent = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = removerTudoQueNaoEhDigito(e?.target?.value);
    return value ? formatterCPFMask(value) : value;
  };

  return (
    <Form.Item
      label="CPF"
      name="cpf"
      {...formItemProps}
      getValueFromEvent={getValueFromEvent}
      rules={[
        { required: true },
        {
          message: 'Deve conter 11 caracteres',
          validator: (_: any, value: string) => {
            const valorValidar = removerTudoQueNaoEhDigito(value);

            if (!valorValidar) return Promise.resolve();

            if (/^[0-9]{11}/.test(valorValidar)) return Promise.resolve();

            return Promise.reject(new Error());
          },
        },
      ]}
    >
      <Input placeholder="Informe o CPF" {...inputProps} />
    </Form.Item>
  );
};

export default InputCPF;
