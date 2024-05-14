import Select from '@/components/lib/inputs/select';
import abaeService from '@/core/services/abae-service';
import { Form, FormItemProps, SelectProps } from 'antd';
import { useWatch } from 'antd/es/form/Form';
import { DefaultOptionType } from 'antd/es/select';
import React, { useCallback, useEffect, useState } from 'react';
import { SGP_SELECT_ABAE } from '~/constantes/ids/select';

const SelectABAE: React.FC<SelectProps> = ({ ...rest }) => {
  const form = Form.useFormInstance();

  const [options, setOptions] = useState<DefaultOptionType[]>([]);

  const ue = useWatch('ue', form);
  const dre = useWatch('dre', form);

  const obterDados = useCallback(async () => {
    const resposta = await abaeService.buscarABAEs(dre.value, ue.value);
    if (resposta.sucesso) {
      const newOptions = resposta.dados.map((item) => ({
        ...item,
        label: item.nome,
        value: item.cpf,
      }));
      setOptions(newOptions);
    } else {
      setOptions([]);
    }
  }, [dre, ue]);

  useEffect(() => {
    form.setFieldValue('cpfABAE', undefined);

    if (ue?.value && dre?.value) {
      obterDados();
    } else {
      setOptions([]);
    }
  }, [ue, dre, form, obterDados]);

  return (
    <Select
      showSearch
      allowClear
      id={SGP_SELECT_ABAE}
      options={options}
      placeholder="ABAE"
      disabled={!ue?.value || !dre?.value}
      {...rest}
    />
  );
};

const SelectABAEFormItem: React.FC<FormItemProps> = ({ children, ...rest }) => (
  <Form.Item label="ABAE" {...rest} name="cpfABAE">
    {children}
  </Form.Item>
);

export { SelectABAE, SelectABAEFormItem };
