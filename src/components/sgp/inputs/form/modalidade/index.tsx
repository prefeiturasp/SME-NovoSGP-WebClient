import { Loader } from '@/@legacy/componentes';
import { OPCAO_TODOS } from '@/@legacy/constantes';
import { SGP_SELECT_MODALIDADE } from '@/@legacy/constantes/ids/select';
import { InitialValueConfig } from '@/core/dto/InitialValueConfig';
import filtroRelatorioService from '@/core/services/filtro-relatorio-service';
import { Form, FormItemProps, SelectProps } from 'antd';
import { useWatch } from 'antd/es/form/Form';
import { DefaultOptionType } from 'antd/es/select';
import React, { useCallback, useEffect, useState } from 'react';
import Select from '../../../../lib/inputs/select';
import { OpcaoDropdownDto } from '@/core/dto/OpcaoDropdownDto';

type SelectModalidadeProps = {
  selectProps?: SelectProps;
  formItemProps?: FormItemProps;
  mostrarOpcaoTodas?: boolean;
};

const SelectModalidade: React.FC<SelectModalidadeProps> = ({
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
  const ue = useWatch('ue', form);

  const name = formItemProps?.name || 'modalidade';

  const disabled = !ue?.value || options?.length === 1 || selectProps?.disabled;

  const limparDados = () => {
    form.setFieldValue(name, undefined);
  };

  const obterDados = useCallback(async () => {
    if (!anoLetivo) return;

    setExibirLoader(true);

    const resposta = await filtroRelatorioService
      .obterModalidades({ ueCodigo: ue.value, anoLetivo })
      .finally(() => setExibirLoader(false));

    if (resposta.sucesso && resposta?.dados?.length) {
      let lista = resposta.dados;

      lista = lista.map((item: OpcaoDropdownDto) => ({
        ...item,
        value: item?.valor,
        label: item?.descricao,
      }));

      if (lista?.length === 1) {
        const fieldValue = lista[0];
        form.setFieldValue(name, fieldValue);
        setInitialValueConfig((item) =>
          item?.loaded ? item : { loaded: true, value: fieldValue },
        );
      } else if (mostrarOpcaoTodas) {
        const OPCAO_TODAS_TURMA: OpcaoDropdownDto = { value: OPCAO_TODOS, label: 'Todas' };
        lista.unshift(OPCAO_TODAS_TURMA);
      }
      setOptions(lista);
    } else {
      limparDados();
    }
  }, [anoLetivo, consideraHistorico, ue, mostrarOpcaoTodas]);

  useEffect(() => {
    if (form.isFieldsTouched()) {
      limparDados();
    }

    if (ue?.value) {
      obterDados();
    }
  }, [ue]);

  return (
    <Loader loading={exibirLoader} tip="">
      <Form.Item
        label="Modalidade"
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
          id={SGP_SELECT_MODALIDADE}
          options={options}
          placeholder="Modalidade"
          labelInValue
          {...selectProps}
          disabled={disabled}
        />
      </Form.Item>
    </Loader>
  );
};

export default SelectModalidade;
