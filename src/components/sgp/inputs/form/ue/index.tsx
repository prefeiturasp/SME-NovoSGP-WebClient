import { Loader } from '@/@legacy/componentes';
import { OPCAO_TODOS } from '@/@legacy/constantes';
import { SGP_SELECT_UE } from '@/@legacy/constantes/ids/select';
import { api, erros } from '@/@legacy/servicos';
import { InitialValueConfig } from '@/core/dto/InitialValueConfig';
import { Form, FormItemProps, SelectProps } from 'antd';
import { useWatch } from 'antd/es/form/Form';
import { DefaultOptionType } from 'antd/es/select';
import React, { useCallback, useEffect, useState } from 'react';
import Select from '../../select';

type SelectUEProps = {
  selectProps?: SelectProps;
  formItemProps?: FormItemProps;
  mostrarOpcaoTodas?: boolean;
};

const SelectUE: React.FC<SelectUEProps> = ({
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
  const dre = useWatch('dre', form);

  const name = formItemProps?.name || 'ue';

  const disabled = !dre?.value || options?.length === 1 || selectProps?.disabled;

  const limparDados = () => {
    form.setFieldValue(name, undefined);
  };

  const obterDados = useCallback(async () => {
    if (!anoLetivo) return;

    const OPCAO_TODAS_UE = { value: OPCAO_TODOS, label: 'Todas' };

    if (dre?.value === OPCAO_TODOS) {
      setOptions([OPCAO_TODAS_UE]);
      form.setFieldValue(name, OPCAO_TODAS_UE);
      setInitialValueConfig((item) =>
        item?.loaded ? item : { loaded: true, value: OPCAO_TODAS_UE },
      );
      return;
    }

    setExibirLoader(true);

    const url = `v1/abrangencias/${consideraHistorico}/dres/${dre?.value}/ues?anoLetivo=${anoLetivo}`;
    const resposta = await api
      .get(url)
      .catch((e) => erros(e))
      .finally(() => setExibirLoader(false));

    if (resposta?.data?.length) {
      let lista = resposta.data;

      lista = lista.map((item: any) => ({ ...item, value: item?.codigo, label: item?.nome }));

      if (lista?.length === 1) {
        const fieldValue = lista[0];

        form.setFieldValue(name, fieldValue);

        setInitialValueConfig((item) =>
          item?.loaded ? item : { loaded: true, value: fieldValue },
        );
      } else if (mostrarOpcaoTodas) {
        lista.unshift(OPCAO_TODAS_UE);
      }

      setOptions(lista);
    } else {
      limparDados();
    }
  }, [anoLetivo, consideraHistorico, dre, mostrarOpcaoTodas]);

  useEffect(() => {
    if (form.isFieldsTouched()) {
      limparDados();
    }

    if (dre?.value) {
      obterDados();
    }
  }, [dre]);

  return (
    <Loader loading={exibirLoader} tip="">
      <Form.Item
        label="Unidade Escolar (UE)"
        name={name}
        initialValue={
          initialValueConfig?.loaded ? initialValueConfig.value : formItemProps?.initialValue
        }
        getValueFromEvent={(_, value) => value}
        {...formItemProps}
      >
        <Select
          loading={exibirLoader}
          showSearch
          allowClear
          id={SGP_SELECT_UE}
          options={options}
          placeholder="Unidade Escolar (UE)"
          labelInValue
          disabled={disabled}
          {...selectProps}
        />
      </Form.Item>
    </Loader>
  );
};

export default SelectUE;
