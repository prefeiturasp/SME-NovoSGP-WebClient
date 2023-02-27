import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useState } from 'react';
import { Loader, SelectComponent } from '~/componentes';
import { SGP_SELECT_COMPONENTE_CURRICULAR } from '~/constantes/ids/select';
import { erros, ServicoDisciplina } from '~/servicos';
import { onchangeMultiSelect } from '~/utils';

export const ComponenteCurricular = ({
  name,
  form,
  onChange,
  disabled,
  multiple,
  showSearch,
  labelRequired,
  nameList,
}) => {
  const [exibirLoader, setExibirLoader] = useState(false);

  const turmaCodigo = form.values?.turmaCodigo;

  const listaComponentesCurriculares = form.values?.[nameList];

  const setInitialValues = !form?.values?.modoEdicao;

  const limparDados = useCallback(() => {
    form.setFieldValue(nameList, []);
    form.setFieldValue(name, undefined);
  }, [form, name, nameList]);

  const obterComponentesCurriculares = useCallback(async () => {
    setExibirLoader(true);

    const retorno = await ServicoDisciplina.obterDisciplinasPorTurma(
      turmaCodigo
    ).catch(e => erros(e));

    if (retorno?.data?.length) {
      const lista = retorno.data;

      if (lista?.length === 1) {
        const codigoAtual = lista?.[0]?.codigoComponenteCurricular;
        if (setInitialValues) {
          form.initialValues[name] = codigoAtual?.toString();
        }
        form.setFieldValue(name, codigoAtual?.toString());
      }

      if (setInitialValues) {
        form.initialValues[nameList] = lista;
      }
      form.setFieldValue(nameList, lista);
    } else {
      limparDados();
    }

    setExibirLoader(false);
  }, [turmaCodigo, form, nameList, name, setInitialValues, limparDados]);

  useEffect(() => {
    if (form.initialValues[nameList]?.length && setInitialValues) return;

    limparDados();
    if (turmaCodigo) obterComponentesCurriculares();


  }, [turmaCodigo]);

  const setarNovoValor = newValue => {
    form.setFieldValue(name, newValue || '');
    form.setFieldTouched(name, true, true);
  };

  return (
    <Loader loading={exibirLoader} ignorarTip>
      <SelectComponent
        form={form}
        name={name}
        label="Componente curricular"
        placeholder="Selecione um componente curricular"
        multiple={multiple}
        lista={listaComponentesCurriculares}
        id={SGP_SELECT_COMPONENTE_CURRICULAR}
        valueOption="codigoComponenteCurricular"
        valueText="nome"
        disabled={
          !turmaCodigo || listaComponentesCurriculares?.length === 1 || disabled
        }
        showSearch={showSearch}
        labelRequired={labelRequired}
        setValueOnlyOnChange
        onChange={valor => {
          form.setFieldValue('modoEdicao', true);

          if (multiple) {
            onchangeMultiSelect(valor, form.values[name], setarNovoValor);
            onChange(valor);
          } else {
            setarNovoValor(valor);
            onChange(valor);
          }
        }}
      />
    </Loader>
  );
};

ComponenteCurricular.propTypes = {
  name: PropTypes.string,
  disabled: PropTypes.bool,
  multiple: PropTypes.bool,
  onChange: PropTypes.func,
  showSearch: PropTypes.bool,
  labelRequired: PropTypes.bool,
  form: PropTypes.oneOfType([PropTypes.any]),
  nameList: PropTypes.string,
};

ComponenteCurricular.defaultProps = {
  form: null,
  name: 'codigoComponenteCurricular',
  disabled: false,
  multiple: false,
  showSearch: true,
  labelRequired: true,
  onChange: () => null,
  nameList: 'listaComponentesCurriculares',
};
