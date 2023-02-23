import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Loader, SelectComponent } from '~/componentes';
import { OPCAO_TODOS } from '~/constantes';
import { SGP_SELECT_UE } from '~/constantes/ids/select';
import { AbrangenciaServico, erros } from '~/servicos';

export const Ue = ({
  name,
  form,
  onChange,
  disabled,
  showSearch,
  labelRequired,
  mostrarOpcaoTodas,
  nameList,
}) => {
  const [exibirLoader, setExibirLoader] = useState(false);

  const { anoLetivo, dreCodigo } = form.values;
  const consideraHistorico = !!form.values?.consideraHistorico;
  const listaUes = form.values?.[nameList];

  const setInitialValues = !form?.values?.modoEdicao;

  const limparDados = () => {
    form.setFieldValue(nameList, []);
    form.setFieldValue(name, undefined);
  };

  const obterUes = useCallback(async () => {
    if (!anoLetivo) return;

    const OPCAO_TODAS_UE = { codigo: OPCAO_TODOS, nome: 'Todas' };

    if (dreCodigo === OPCAO_TODOS) {
      form.setFieldValue(nameList, [OPCAO_TODAS_UE]);
      form.setFieldValue(name, OPCAO_TODOS);
      return;
    }

    setExibirLoader(true);

    const resposta = await AbrangenciaServico.buscarUes(
      dreCodigo,
      `v1/abrangencias/${consideraHistorico}/dres/${dreCodigo}/ues?anoLetivo=${anoLetivo}`,
      true
    )
      .catch(e => erros(e))
      .finally(() => setExibirLoader(false));

    if (resposta?.data?.length) {
      const lista = resposta.data;

      if (lista?.length === 1) {
        if (setInitialValues) {
          form.initialValues[name] = String(lista[0]?.codigo);
        }
        form.setFieldValue(name, String(lista[0]?.codigo));
      } else if (mostrarOpcaoTodas) {
        lista.unshift(OPCAO_TODAS_UE);
      }

      if (setInitialValues) {
        form.initialValues[nameList] = lista;
      }
      form.setFieldValue(nameList, lista);
    } else {
      limparDados();
    }

  }, [consideraHistorico, anoLetivo, dreCodigo]);

  useEffect(() => {
    if (form.initialValues[nameList]?.length && setInitialValues) return;

    limparDados();
    if (dreCodigo) obterUes();


  }, [dreCodigo]);

  return (
    <Loader loading={exibirLoader} ignorarTip>
      <SelectComponent
        name={name}
        form={form}
        valueOption="codigo"
        valueText="nome"
        lista={listaUes}
        id={SGP_SELECT_UE}
        showSearch={showSearch}
        labelRequired={labelRequired}
        label="Unidade Escolar (UE)"
        placeholder="Unidade Escolar (UE)"
        disabled={!dreCodigo || listaUes?.length === 1 || disabled}
        setValueOnlyOnChange
        onChange={newValue => {
          form.setFieldValue('modoEdicao', true);
          form.setFieldValue(name, newValue);
          form.setFieldTouched(name, true, true);
          onChange(newValue);
        }}
      />
    </Loader>
  );
};

Ue.propTypes = {
  name: PropTypes.string,
  disabled: PropTypes.bool,
  onChange: PropTypes.func,
  showSearch: PropTypes.bool,
  labelRequired: PropTypes.bool,
  mostrarOpcaoTodas: PropTypes.bool,
  form: PropTypes.oneOfType([PropTypes.any]),
  nameList: PropTypes.string,
};

Ue.defaultProps = {
  form: null,
  name: 'ueCodigo',
  disabled: false,
  showSearch: true,
  labelRequired: true,
  onChange: () => null,
  mostrarOpcaoTodas: true,
  nameList: 'listaUes',
};
