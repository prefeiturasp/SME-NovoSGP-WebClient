import { SGP_SELECT_AUSENCIAS } from '@/@legacy/constantes/ids/select';
import consultaCriancasEstudantesAusentesService from '@/core/services/consulta-criancas-estudantes-ausentes-service';
import { Form, FormItemProps, SelectProps } from 'antd';
import { DefaultOptionType } from 'antd/es/select';
import React, { useEffect, useState } from 'react';
import Select from '../../../../lib/inputs/select';

type SelectAusenciasProps = {
  selectProps?: SelectProps;
  formItemProps?: FormItemProps;
};
const SelectAusencias: React.FC<SelectAusenciasProps> = ({ selectProps, formItemProps }) => {
  const [options, setOptions] = useState<DefaultOptionType[]>([]);

  const obterTipos = async () => {
    const resposta = await consultaCriancasEstudantesAusentesService.obterAusencias();

    if (resposta.sucesso) {
      const newOptions = resposta.dados.map((item) => ({ label: item.descricao, value: item.id }));
      setOptions(newOptions);
    } else {
      setOptions([]);
    }
  };

  useEffect(() => {
    obterTipos();
  }, []);

  return (
    <Form.Item label="Ausências" name="ausencias" {...formItemProps}>
      <Select
        showSearch
        allowClear
        id={SGP_SELECT_AUSENCIAS}
        {...selectProps}
        options={options}
        placeholder="Ausências"
      />
    </Form.Item>
  );
};

export default SelectAusencias;
