import { Loader } from '@/@legacy/componentes';
import { OPCAO_TODOS } from '@/@legacy/constantes';
import { SGP_SELECT_SEMESTRE } from '@/@legacy/constantes/ids/select';
import { InitialValueConfig } from '@/core/dto/InitialValueConfig';
import { ModalidadeEnum } from '@/core/enum/modalidade-enum';
import abrangenciaService from '@/core/services/abrangencia-service';
import { Form, FormItemProps, SelectProps } from 'antd';
import { useWatch } from 'antd/es/form/Form';
import { DefaultOptionType } from 'antd/es/select';
import React, { useCallback, useEffect, useState } from 'react';
import Select from '../../select';

type SelectSemestreProps = {
  selectProps?: SelectProps;
  formItemProps?: FormItemProps;
};

const SelectSemestre: React.FC<SelectSemestreProps> = ({ selectProps, formItemProps }) => {
  const form = Form.useFormInstance();

  const [options, setOptions] = useState<DefaultOptionType[]>([]);
  const [exibirLoader, setExibirLoader] = useState<boolean>(false);
  const [initialValueConfig, setInitialValueConfig] = useState<InitialValueConfig>();

  const consideraHistorico = useWatch('consideraHistorico', form);
  const anoLetivo = useWatch('anoLetivo', form);
  const ue = useWatch('ue', form);
  const dre = useWatch('dre', form);
  const modalidade = useWatch('modalidade', form);

  const name = formItemProps?.name || 'semestre';

  const ehEJAouCelp =
    Number(modalidade?.value) === ModalidadeEnum.EJA ||
    Number(modalidade?.value) === ModalidadeEnum.CELP;

  const disabled =
    !modalidade?.value || !ehEJAouCelp || options?.length === 1 || selectProps?.disabled;

  const limparDados = () => {
    form.setFieldValue(name, undefined);
  };

  const obterDados = useCallback(async () => {
    if (!anoLetivo || !dre?.value || !ue?.value || !modalidade?.value) return;

    setExibirLoader(true);

    const resposta = await abrangenciaService
      .obterSemestres({
        consideraHistorico,
        anoLetivo,
        dreCodigo: dre?.value === OPCAO_TODOS ? '' : dre?.value,
        ueCodigo: ue?.value === OPCAO_TODOS ? '' : ue?.value,
        modalidade: modalidade?.value,
      })
      .finally(() => setExibirLoader(false));

    if (resposta.sucesso && resposta?.dados?.length) {
      const lista = resposta.dados.map((semetre: number) => ({
        value: semetre,
        label: semetre,
      }));

      if (lista?.length === 1) {
        const fieldValue = lista[0];
        form.setFieldValue(name, fieldValue);
        setInitialValueConfig((item) =>
          item?.loaded ? item : { loaded: true, value: fieldValue },
        );
      }
      setOptions(lista);
    } else {
      limparDados();
    }
  }, [anoLetivo, consideraHistorico, ue, dre, modalidade]);

  useEffect(() => {
    if (form.isFieldsTouched()) {
      limparDados();
    }

    if (modalidade?.value && ehEJAouCelp) {
      obterDados();
    }
  }, [modalidade, ehEJAouCelp]);

  return (
    <Loader loading={exibirLoader} tip="">
      <Form.Item
        label="Semestre"
        name={name}
        initialValue={
          initialValueConfig?.loaded ? initialValueConfig.value : formItemProps?.initialValue
        }
        getValueFromEvent={(_, value) => value}
        {...formItemProps}
        rules={[{ required: ehEJAouCelp }]}
      >
        <Select
          loading={exibirLoader}
          showSearch
          allowClear
          id={SGP_SELECT_SEMESTRE}
          options={options}
          placeholder="Semestre"
          labelInValue
          {...selectProps}
          disabled={disabled}
        />
      </Form.Item>
    </Loader>
  );
};

export default SelectSemestre;
