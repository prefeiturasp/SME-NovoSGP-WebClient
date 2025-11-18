import Select from '@/components/lib/inputs/select';
import {
  OrdemProcedimentoRealizadoEnum,
  OrdemProcedimentoRealizadoEnumDisplay,
} from '@/core/enum/ordem-procedimento-realizado-enum';
import { Form, FormItemProps, SelectProps } from 'antd';
import { DefaultOptionType } from 'antd/es/select';
import React from 'react';
import { SGP_SELECT_ENTROU_CONTATO_FAMILIA_POR } from '~/constantes/ids/select';

type SelectEntrouContatoFamiliaPorProps = {
  selectProps?: SelectProps;
  formItemProps?: FormItemProps;
};
const SelectEntrouContatoFamiliaPor: React.FC<SelectEntrouContatoFamiliaPorProps> = ({
  formItemProps,
  selectProps,
}) => {
  const options: DefaultOptionType[] = [
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
      <Select
        allowClear
        options={options}
        placeholder="Selecione uma opção"
        id={SGP_SELECT_ENTROU_CONTATO_FAMILIA_POR}
        {...selectProps}
      />
    </Form.Item>
  );
};
export default SelectEntrouContatoFamiliaPor;
