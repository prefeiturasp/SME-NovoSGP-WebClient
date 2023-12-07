import { Loader } from '@/@legacy/componentes';
import { OPCAO_TODOS } from '@/@legacy/constantes';
import { SGP_SELECT_TURMA } from '@/@legacy/constantes/ids/select';
import { AbrangenciaTurmaRetornoDto } from '@/core/dto/AbrangenciaTurmaRetorno';
import { InitialValueConfig } from '@/core/dto/InitialValueConfig';
import { OpcaoDropdownDto } from '@/core/dto/OpcaoDropdownDto';
import { ModalidadeEnum } from '@/core/enum/modalidade-enum';
import abrangenciaService from '@/core/services/abrangencia-service';
import { Form, FormItemProps, SelectProps } from 'antd';
import { useWatch } from 'antd/es/form/Form';
import { DefaultOptionType } from 'antd/es/select';
import React, { useCallback, useEffect, useState } from 'react';
import Select from '../../../../lib/inputs/select';

type SelectTurmaProps = {
  selectProps?: SelectProps;
  formItemProps?: FormItemProps;
  mostrarOpcaoTodas?: boolean;
  listaSomenteComOpcaoTodas?: boolean;
  selecionarOpcaoTodasAoCarregar?: boolean;
};

const SelectTurma: React.FC<SelectTurmaProps> = ({
  selectProps,
  formItemProps,
  mostrarOpcaoTodas = false,
  listaSomenteComOpcaoTodas = false,
  selecionarOpcaoTodasAoCarregar = false,
}) => {
  const form = Form.useFormInstance();

  const [options, setOptions] = useState<DefaultOptionType[]>([]);
  const [exibirLoader, setExibirLoader] = useState<boolean>(false);
  const [initialValueConfig, setInitialValueConfig] = useState<InitialValueConfig>();

  const consideraHistorico = useWatch('consideraHistorico', form);
  const anoLetivo = useWatch('anoLetivo', form);
  const ue = useWatch('ue', form);
  const modalidade = useWatch('modalidade', form);
  const semestre = useWatch('semestre', form);

  const name = formItemProps?.name || 'turma';

  const isMultiple = selectProps?.mode === 'multiple';

  const ehEJAouCelp =
    Number(modalidade?.value) === ModalidadeEnum.EJA ||
    Number(modalidade?.value) === ModalidadeEnum.CELP;

  const disabled =
    !ue?.value || (ehEJAouCelp && !semestre) || options?.length === 1 || selectProps?.disabled;

  const limparDados = () => {
    form.setFieldValue(name, undefined);
    form.setFieldValue('listaTurmas', []);
  };

  const obterDados = useCallback(async () => {
    if (!anoLetivo || !ue?.value || !modalidade) return;

    if (ehEJAouCelp && !semestre) return;

    const OPCAO_TODAS_TURMA: OpcaoDropdownDto = { value: OPCAO_TODOS, label: 'Todas' };

    if (ue.value === OPCAO_TODOS || listaSomenteComOpcaoTodas) {
      const codigoAtual = isMultiple ? [OPCAO_TODAS_TURMA] : OPCAO_TODAS_TURMA;

      setOptions([OPCAO_TODAS_TURMA]);
      form.setFieldValue('listaTurmas', [OPCAO_TODAS_TURMA]);
      form.setFieldValue(name, codigoAtual);
      return;
    }

    setExibirLoader(true);

    const resposta = await abrangenciaService
      .obterTurmas({
        consideraHistorico,
        anoLetivo,
        ueCodigo: ue.value,
        modalidade: modalidade?.value === OPCAO_TODOS ? '' : modalidade?.value,
        periodo: semestre?.value,
      })
      .finally(() => setExibirLoader(false));

    if (resposta.sucesso && resposta?.dados?.length) {
      let lista = resposta.dados;

      lista = lista.map((item: AbrangenciaTurmaRetornoDto) => ({
        ...item,
        value: item?.codigo,
        label: item?.nomeFiltro,
      }));

      if (lista?.length === 1) {
        const fieldValue = lista[0];
        form.setFieldValue(name, fieldValue);
        setInitialValueConfig((item) =>
          item?.loaded ? item : { loaded: true, value: fieldValue },
        );
      } else if (mostrarOpcaoTodas) {
        if (selecionarOpcaoTodasAoCarregar) {
          const codigoAtual = isMultiple ? [OPCAO_TODAS_TURMA] : OPCAO_TODAS_TURMA;

          form.setFieldValue(name, codigoAtual);
        }

        lista.unshift(OPCAO_TODAS_TURMA);
      }
      setOptions(lista);
      form.setFieldValue('listaTurmas', lista);
    } else {
      limparDados();
    }
  }, [
    anoLetivo,
    consideraHistorico,
    ue,
    modalidade,
    semestre,
    mostrarOpcaoTodas,
    ehEJAouCelp,
    isMultiple,
    selecionarOpcaoTodasAoCarregar,
    name,
  ]);

  useEffect(() => {
    if (form.isFieldsTouched()) {
      limparDados();
    }

    if (modalidade?.value) {
      obterDados();
    }
  }, [modalidade, semestre]);

  return (
    <Loader loading={exibirLoader} tip="">
      <Form.Item
        label="Turma"
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
          id={SGP_SELECT_TURMA}
          options={options}
          placeholder="Turma"
          labelInValue
          {...selectProps}
          disabled={disabled}
        />
      </Form.Item>
    </Loader>
  );
};

export default SelectTurma;
