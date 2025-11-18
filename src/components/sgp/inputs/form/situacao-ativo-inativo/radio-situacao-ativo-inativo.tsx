import { Form, FormItemProps, Radio as RadioAnt, RadioGroupProps } from 'antd';
import { AbstractCheckboxGroupProps } from 'antd/es/checkbox/Group';
import React from 'react';

type SRadioSituacaoAtivoInativoProps = {
  radioGroupProps?: RadioGroupProps;
  formItemProps?: FormItemProps;
};

const RadioSituacaoAtivoInativo: React.FC<SRadioSituacaoAtivoInativoProps> = ({
  radioGroupProps,
  formItemProps,
}) => {
  const options: AbstractCheckboxGroupProps['options'] = [
    {
      label: 'Ativo',
      value: true,
    },
    {
      label: 'Inativo',
      value: false,
    },
  ];

  return (
    <Form.Item label="Situação" name="situacao" {...formItemProps} valuePropName="value">
      <RadioAnt.Group options={options} {...radioGroupProps} defaultValue={true} />
    </Form.Item>
  );
};

export default RadioSituacaoAtivoInativo;
