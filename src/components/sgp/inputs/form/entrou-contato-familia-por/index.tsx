import {
  OrdemProcedimentoRealizadoEnum,
  OrdemProcedimentoRealizadoEnumDisplay,
} from '@/core/enum/ordem-procedimento-realizado-enum';
import { CheckboxOptionType, Form, FormItemProps, Radio, RadioGroupProps } from 'antd';
import React from 'react';
import { SGP_RADIO_RADIO_ENTROU_CONTATO_FAMILIA_POR } from '~/constantes/ids/radio';

type RadioEntrouContatoFamiliaPorProps = {
  radioGroupProps?: RadioGroupProps;
  formItemProps?: FormItemProps;
};
const RadioEntrouContatoFamiliaPor: React.FC<RadioEntrouContatoFamiliaPorProps> = ({
  formItemProps,
  radioGroupProps,
}) => {
  const options: Array<CheckboxOptionType | string | number> = [
    {
      label: OrdemProcedimentoRealizadoEnumDisplay[OrdemProcedimentoRealizadoEnum.Nenhum],
      value: OrdemProcedimentoRealizadoEnum.Nenhum,
    },
    {
      label: OrdemProcedimentoRealizadoEnumDisplay[OrdemProcedimentoRealizadoEnum.Telefone],
      value: OrdemProcedimentoRealizadoEnum.Telefone,
    },
    {
      label: OrdemProcedimentoRealizadoEnumDisplay[OrdemProcedimentoRealizadoEnum.VisitaDomiciliar],
      value: OrdemProcedimentoRealizadoEnum.VisitaDomiciliar,
    },
  ];

  return (
    <Form.Item
      name="ordemProcedimentoRealizado"
      label="Você entrou em contato com a família por meio de:"
      {...formItemProps}
    >
      <Radio.Group
        options={options}
        id={SGP_RADIO_RADIO_ENTROU_CONTATO_FAMILIA_POR}
        {...radioGroupProps}
      />
    </Form.Item>
  );
};
export default RadioEntrouContatoFamiliaPor;
