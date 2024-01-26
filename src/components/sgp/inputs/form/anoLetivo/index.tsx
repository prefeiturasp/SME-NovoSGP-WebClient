import { Loader } from '@/@legacy/componentes';
import { FiltroHelper } from '@/@legacy/componentes-sgp';
import { SGP_SELECT_ANO_LETIVO } from '@/@legacy/constantes/ids/select';
import { erros } from '@/@legacy/servicos';
import { InitialValueConfig } from '@/core/dto/InitialValueConfig';
import { Form, FormItemProps, SelectProps } from 'antd';
import { useWatch } from 'antd/es/form/Form';
import { DefaultOptionType } from 'antd/es/select';
import React, { useCallback, useEffect, useState } from 'react';
import { ordenarDescPor } from '~/utils';
import Select from '../../../../lib/inputs/select';

type SelectAnoLetivoProps = {
  selectProps?: SelectProps;
  formItemProps?: FormItemProps;
  anoMinimo?: number;
};

const SelectAnoLetivo: React.FC<SelectAnoLetivoProps> = ({
  selectProps,
  formItemProps,
  anoMinimo,
}) => {
  const form = Form.useFormInstance();

  const [options, setOptions] = useState<DefaultOptionType[]>([]);
  const [exibirLoader, setExibirLoader] = useState<boolean>(false);
  const [initialValueConfig, setInitialValueConfig] = useState<InitialValueConfig>();

  const consideraHistorico = useWatch('consideraHistorico', form);

  const name = formItemProps?.name || 'anoLetivo';

  const disabled = options?.length === 1 || selectProps?.disabled;

  const limparDados = () => {
    form.setFieldValue(name, undefined);
    setOptions([]);
  };

  const obterDados = useCallback(async () => {
    setExibirLoader(true);

    const resposta = await FiltroHelper.obterAnosLetivos({
      consideraHistorico: !!consideraHistorico,
      anoMinimo,
    })
      .catch((e) => erros(e))
      .finally(() => setExibirLoader(false));

    if (resposta?.length) {
      const anosOrdenados = ordenarDescPor(resposta, 'valor');

      if (anosOrdenados?.length) {
        const lista = anosOrdenados.map((item: any) => ({
          ...item,
          value: item?.valor,
          label: item?.desc,
        }));

        const fieldValue = lista[0];
        form.setFieldValue(name, fieldValue?.value);

        setInitialValueConfig((item) =>
          item?.loaded ? item : { loaded: true, value: fieldValue?.value },
        );
        setOptions(lista);
      } else {
        limparDados();
      }
    } else {
      limparDados();
    }
  }, [consideraHistorico, anoMinimo, name]);

  useEffect(() => {
    limparDados();

    obterDados();
  }, [consideraHistorico]);

  return (
    <Loader loading={exibirLoader} tip="">
      <Form.Item
        label="Ano Letivo"
        name={name}
        initialValue={
          initialValueConfig?.loaded ? initialValueConfig.value : formItemProps?.initialValue
        }
        {...formItemProps}
      >
        <Select
          loading={exibirLoader}
          showSearch
          allowClear
          id={SGP_SELECT_ANO_LETIVO}
          options={options}
          placeholder="Ano Letivo"
          {...selectProps}
          disabled={disabled}
        />
      </Form.Item>
    </Loader>
  );
};

export default SelectAnoLetivo;
