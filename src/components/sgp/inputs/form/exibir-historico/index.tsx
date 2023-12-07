import { Checkbox, CheckboxProps, Form, FormItemProps, Typography } from 'antd';
import React from 'react';
import { SGP_CHECKBOX_EXIBIR_HISTORICO } from '~/constantes/ids/checkbox';

type CheckboxExibirHistoricoProps = {
  checkboxProps?: CheckboxProps;
  formItemProps?: FormItemProps;
};

const CheckboxExibirHistorico: React.FC<CheckboxExibirHistoricoProps> = ({
  checkboxProps,
  formItemProps,
}) => {
  const name = formItemProps?.name || 'consideraHistorico';

  return (
    <Form.Item name={name} {...formItemProps} valuePropName="checked">
      <Checkbox id={SGP_CHECKBOX_EXIBIR_HISTORICO} {...checkboxProps}>
        <Typography.Text strong>Exibir histórico?</Typography.Text>
      </Checkbox>
    </Form.Item>
  );
};

export default CheckboxExibirHistorico;
