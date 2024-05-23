import Select from '@/components/lib/inputs/select';
import { BimestreEnum, BimestreEnumDisplay } from '@/core/enum/bimestre-tab-enum';
import { Form } from 'antd';
import { useWatch } from 'antd/es/form/Form';
import useFormInstance from 'antd/es/form/hooks/useFormInstance';
import { DefaultOptionType } from 'antd/es/select';

import React, { useEffect } from 'react';
import { OPCAO_TODOS } from '~/constantes';
import { SGP_SELECT_BIMESTRE } from '~/constantes/ids/select';

export const SelectBimestresFrequenciaProdutividade: React.FC = () => {
  const form = useFormInstance();
  const ue = useWatch('ue');

  useEffect(() => {
    form.setFieldValue('bimestre', undefined);
  }, [ue, form]);

  const lista: DefaultOptionType[] = [
    {
      label: 'Todos',
      value: OPCAO_TODOS,
    },
    {
      label: BimestreEnumDisplay[BimestreEnum.BIMESTRE_1],
      value: BimestreEnum.BIMESTRE_1,
    },
    {
      label: BimestreEnumDisplay[BimestreEnum.BIMESTRE_2],
      value: BimestreEnum.BIMESTRE_2,
    },
    {
      label: BimestreEnumDisplay[BimestreEnum.BIMESTRE_3],
      value: BimestreEnum.BIMESTRE_3,
    },
    {
      label: BimestreEnumDisplay[BimestreEnum.BIMESTRE_4],
      value: BimestreEnum.BIMESTRE_4,
    },
  ];

  return (
    <Form.Item label="Bimestre" name="bimestre" rules={[{ required: true }]}>
      <Select
        options={lista}
        placeholder="Selecione um bimestre"
        disabled={!ue?.value}
        id={SGP_SELECT_BIMESTRE}
      />
    </Form.Item>
  );
};
