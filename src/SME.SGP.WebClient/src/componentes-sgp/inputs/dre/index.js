import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Loader, SelectComponent } from '~/componentes';
import { FiltroHelper } from '~/componentes-sgp';
import { OPCAO_TODOS } from '~/constantes';
import { SGP_SELECT_DRE } from '~/constantes/ids/select';
import { AbrangenciaServico, erros } from '~/servicos';

export const Dre = ({
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

  const { anoLetivo } = form.values;
  const consideraHistorico = !!form.values?.consideraHistorico;
  const listaDres = form.values?.[nameList];

  const setInitialValues = !form?.values?.modoEdicao;

  const limparDados = () => {
    form.setFieldValue(nameList, []);
    form.setFieldValue(name, undefined);
  };

  const obterDres = useCallback(async () => {
    setExibirLoader(true);

    const resposta = await AbrangenciaServico.buscarDres(
      `v1/abrangencias/${consideraHistorico}/dres?anoLetivo=${anoLetivo}`
    )
      .catch(e => erros(e))
      .finally(() => setExibirLoader(false));

    if (resposta?.data?.length) {
      const lista = resposta.data.sort(FiltroHelper.ordenarLista('nome'));

      if (lista?.length === 1) {
        if (setInitialValues) {
          form.initialValues[name] = String(lista[0]?.codigo);
        }
        form.setFieldValue(name, String(lista[0]?.codigo));
      } else if (mostrarOpcaoTodas) {
        const OPCAO_TODAS_DRE = { codigo: OPCAO_TODOS, nome: 'Todas' };
        lista.unshift(OPCAO_TODAS_DRE);
      }

      if (setInitialValues) {
        form.initialValues[nameList] = lista;
      }
      form.setFieldValue(nameList, lista);
    } else {
      limparDados();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [anoLetivo, consideraHistorico]);

  useEffect(() => {
    if (form.initialValues[nameList]?.length && setInitialValues) return;

    limparDados();

    if (anoLetivo) obterDres();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [anoLetivo]);

  return (
    <Loader loading={exibirLoader} ignorarTip>
      <SelectComponent
        name={name}
        form={form}
        lista={listaDres}
        valueText="nome"
        valueOption="codigo"
        id={SGP_SELECT_DRE}
        showSearch={showSearch}
        labelRequired={labelRequired}
        label="Diretoria Regional de Educação (DRE)"
        placeholder="Diretoria Regional De Educação (DRE)"
        disabled={!anoLetivo || listaDres?.length === 1 || disabled}
        setValueOnlyOnChange
        onChange={newValue => {
          form.setFieldValue('modoEdicao', true);
          form.setFieldValue('ueCodigo', undefined);

          form.setFieldValue(name, newValue);
          form.setFieldTouched(name, true, true);
          onChange(newValue);
        }}
      />
    </Loader>
  );
};

Dre.propTypes = {
  name: PropTypes.string,
  disabled: PropTypes.bool,
  onChange: PropTypes.func,
  showSearch: PropTypes.bool,
  labelRequired: PropTypes.bool,
  mostrarOpcaoTodas: PropTypes.bool,
  form: PropTypes.oneOfType([PropTypes.any]),
  nameList: PropTypes.string,
};

Dre.defaultProps = {
  form: null,
  disabled: false,
  showSearch: true,
  name: 'dreCodigo',
  labelRequired: true,
  onChange: () => null,
  mostrarOpcaoTodas: true,
  nameList: 'listaDres',
};
