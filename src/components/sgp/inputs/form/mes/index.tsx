import { Form, SelectProps } from 'antd';
import { DefaultOptionType } from 'antd/es/select';
import React, { PropsWithChildren, useCallback, useEffect, useState } from 'react';
import { SGP_SELECT_MESES } from '~/constantes/ids/select';
import { obterTodosMeses } from '~/utils';
import Select from '../../../../lib/inputs/select';

type SelectMesProps = {
  mesesRemover?: string[];
} & SelectProps;
const SelectMes: React.FC<SelectMesProps> = ({ mesesRemover, ...rest }) => {
  const [options, setOptions] = useState<DefaultOptionType[]>([]);

  const montarMeses = useCallback(() => {
    let meses = obterTodosMeses();

    meses.unshift({ numeroMes: '0', nome: 'Acumulado' });

    if (mesesRemover?.length) {
      meses = meses.filter((mes) => !mesesRemover.includes(mes.numeroMes));
    }

    const lista = meses.map((item) => ({
      ...item,
      value: item?.numeroMes,
      label: item?.nome,
    }));

    setOptions(lista);
  }, [mesesRemover]);

  useEffect(() => {
    montarMeses();
  }, [montarMeses]);

  return <Select id={SGP_SELECT_MESES} options={options} placeholder="Mês" {...rest} />;
};

const SelectMesFormItem: React.FC<PropsWithChildren> = ({ children, ...rest }) => (
  <Form.Item label="Mês" name="mes" {...rest}>
    {children}
  </Form.Item>
);

export { SelectMes, SelectMesFormItem };
