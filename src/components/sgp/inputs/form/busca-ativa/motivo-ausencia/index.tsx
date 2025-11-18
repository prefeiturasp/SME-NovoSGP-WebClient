import Select from '@/components/lib/inputs/select';
import buscaAtivaService from '@/core/services/busca-ativa-service';
import { Form, FormItemProps, SelectProps } from 'antd';
import { DefaultOptionType } from 'antd/es/select';
import React, { useCallback, useEffect, useState } from 'react';
import { SGP_SELECT_MOTIVO_AUSENCIA } from '~/constantes/ids/select';

const SelectMotivoAusenciaBuscaAtiva: React.FC<SelectProps> = ({ ...rest }) => {
  const [options, setOptions] = useState<DefaultOptionType[]>([]);

  const obterDados = useCallback(async () => {
    const resposta = await buscaAtivaService.obterMotivosAusencia();
    if (resposta.sucesso) {
      const newOptions = resposta.dados.map((item) => ({
        ...item,
        label: item.nome,
        value: item.id,
      }));
      setOptions(newOptions);
    } else {
      setOptions([]);
    }
  }, []);

  useEffect(() => {
    obterDados();
  }, [obterDados]);

  return (
    <Select
      showSearch
      allowClear
      id={SGP_SELECT_MOTIVO_AUSENCIA}
      options={options}
      placeholder="Motivo de Ausência"
      {...rest}
    />
  );
};

const SelectMotivoAusenciaBuscaAtivaFormItem: React.FC<FormItemProps> = ({ children, ...rest }) => (
  <Form.Item label="Motivo de Ausência" name="motivoAusenciaId" {...rest}>
    {children}
  </Form.Item>
);

export { SelectMotivoAusenciaBuscaAtiva, SelectMotivoAusenciaBuscaAtivaFormItem };
