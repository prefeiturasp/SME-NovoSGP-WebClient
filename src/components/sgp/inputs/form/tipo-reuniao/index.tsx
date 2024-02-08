import Select from '@/components/lib/inputs/select';
import registroColetivoService from '@/core/services/registro-coletivo-service';
import { Form, FormItemProps, SelectProps } from 'antd';
import { DefaultOptionType } from 'antd/es/select';
import React, { useEffect, useState } from 'react';
import { SGP_SELECT_TIPO_REUNIAO } from '~/constantes/ids/select';

const SelectTipoReuniao: React.FC<SelectProps> = ({ ...rest }) => {
  const [options, setOptions] = useState<DefaultOptionType[]>([]);

  const obterDados = async () => {
    const resposta = await registroColetivoService.onterTipoReuniao();
    if (resposta.sucesso) {
      const newOptions = resposta.dados.map((item) => ({
        label: item.descricao,
        value: item.valor,
      }));
      setOptions(newOptions);
    } else {
      setOptions([]);
    }
  };

  useEffect(() => {
    obterDados();
  }, []);

  return (
    <Select
      showSearch
      allowClear
      id={SGP_SELECT_TIPO_REUNIAO}
      mode="multiple"
      options={options}
      placeholder="Tipo de reunião"
      {...rest}
    />
  );
};

const SelectTipoReuniaoFormItem: React.FC<FormItemProps> = ({ children, ...rest }) => (
  <Form.Item label="Tipo de reunião" name="tipoReuniao" {...rest}>
    {children}
  </Form.Item>
);

export { SelectTipoReuniao, SelectTipoReuniaoFormItem };
