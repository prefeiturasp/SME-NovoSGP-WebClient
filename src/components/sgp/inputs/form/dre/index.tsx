import { Loader } from '@/@legacy/componentes';
import { FiltroHelper } from '@/@legacy/componentes-sgp';
import { OPCAO_TODOS } from '@/@legacy/constantes';
import { SGP_SELECT_DRE } from '@/@legacy/constantes/ids/select';
import { api, erros } from '@/@legacy/servicos';
import { InitialValueConfig } from '@/core/dto/InitialValueConfig';
import { Form, FormItemProps, SelectProps } from 'antd';
import { useWatch } from 'antd/es/form/Form';
import { DefaultOptionType } from 'antd/es/select';
import React, { useCallback, useEffect, useState } from 'react';
import Select from '../../../../lib/inputs/select';

type SelectDREProps = {
  selectProps?: SelectProps;
  formItemProps?: FormItemProps;
  mostrarOpcaoTodas?: boolean;
};

const SelectDRE: React.FC<SelectDREProps> = ({
  selectProps,
  formItemProps,
  mostrarOpcaoTodas = false,
}) => {
  const form = Form.useFormInstance();

  const [options, setOptions] = useState<DefaultOptionType[]>([]);
  const [exibirLoader, setExibirLoader] = useState<boolean>(false);
  const [initialValueConfig, setInitialValueConfig] = useState<InitialValueConfig>();

  const consideraHistorico = useWatch('consideraHistorico', form);
  const anoLetivo = useWatch('anoLetivo', form);

  const name = formItemProps?.name || 'dre';

  const disabled = !anoLetivo || options?.length === 1 || selectProps?.disabled;

  const limparDados = () => {
    form.setFieldValue(name, undefined);
  };

  const obterDados = useCallback(async () => {
    setExibirLoader(true);

    const url = `v1/abrangencias/${consideraHistorico}/dres?anoLetivo=${anoLetivo}`;

    const resposta = await api
      .get(url)
      .catch((e) => erros(e))
      .finally(() => setExibirLoader(false));
    // @ts-ignore
    if (resposta?.data?.length) {
      let lista = resposta.data.sort(FiltroHelper.ordenarLista('nome'));

      lista = lista.map((item: any) => ({ ...item, value: item?.codigo, label: item?.nome }));

      if (lista?.length === 1) {
        const fieldValue = lista[0];
        form.setFieldValue(name, fieldValue);

        setInitialValueConfig((item) =>
          item?.loaded ? item : { loaded: true, value: fieldValue },
        );
      } else if (mostrarOpcaoTodas) {
        const OPCAO_TODAS_DRE = { value: OPCAO_TODOS, label: 'Todas' };
        lista.unshift(OPCAO_TODAS_DRE);
      }

      setOptions(lista);
    } else {
      limparDados();
    }
  }, [anoLetivo, consideraHistorico, mostrarOpcaoTodas]);

  useEffect(() => {
    limparDados();

    if (anoLetivo) {
      obterDados();
    }
  }, [anoLetivo]);

  return (
    <Loader loading={exibirLoader} tip="">
      <Form.Item
        label="Diretoria Regional de Educação (DRE)"
        name={name}
        getValueFromEvent={(_, value) => value}
        initialValue={
          initialValueConfig?.loaded ? initialValueConfig.value : formItemProps?.initialValue
        }
        {...formItemProps}
      >
        <Select
          loading={exibirLoader}
          showSearch
          allowClear
          id={SGP_SELECT_DRE}
          options={options}
          placeholder="Diretoria Regional de Educação (DRE)"
          labelInValue
          {...selectProps}
          disabled={disabled}
        />
      </Form.Item>
    </Loader>
  );
};

export default SelectDRE;
