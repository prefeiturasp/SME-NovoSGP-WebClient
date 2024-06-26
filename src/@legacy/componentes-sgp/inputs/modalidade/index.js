import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useState } from 'react';
import { OPCAO_TODOS } from '~/constantes';
import { Loader, SelectComponent } from '~/componentes';
import { SGP_SELECT_MODALIDADE } from '~/constantes/ids/select';
import { erros, ServicoFiltroRelatorio } from '~/servicos';
import { onchangeMultiSelect } from '~/utils';

export const Modalidade = ({
  name,
  form,
  onChange,
  disabled,
  showSearch,
  labelRequired,
  mostrarOpcaoTodas,
  nameList,
  multiple,
}) => {
  const [exibirLoader, setExibirLoader] = useState(false);

  const { anoLetivo, ueCodigo } = form.values;
  const consideraHistorico = !!form.values?.consideraHistorico;
  const listaModalidades = form.values?.[nameList];

  const setInitialValues = !form?.values?.modoEdicao;

  const limparDados = () => {
    form.setFieldValue(nameList, []);
    form.setFieldValue(name, undefined);
  };

  const obterModalidades = useCallback(async () => {
    if (!anoLetivo) return;

    setExibirLoader(true);

    const resposta = await ServicoFiltroRelatorio.obterModalidades(
      ueCodigo,
      anoLetivo,
      consideraHistorico
    )
      .catch(e => erros(e))
      .finally(() => setExibirLoader(false));

    if (resposta?.data?.length) {
      const lista = resposta.data;

      if (lista?.length === 1) {
        let valorAtual = String(lista[0]?.valor);
        valorAtual = multiple ? [valorAtual] : valorAtual;

        if (setInitialValues) {
          form.initialValues[name] = valorAtual;
        }
        form.setFieldValue(name, valorAtual);
      } else if (mostrarOpcaoTodas) {
        const OPCAO_TODAS_TURMA = { valor: OPCAO_TODOS, descricao: 'Todas' };

        lista.unshift(OPCAO_TODAS_TURMA);
      }

      if (setInitialValues) {
        form.initialValues[nameList] = lista;
      }
      form.setFieldValue(nameList, lista);
    } else {
      limparDados();
    }
  }, [consideraHistorico, anoLetivo, ueCodigo]);

  useEffect(() => {
    if (form.initialValues[nameList]?.length && setInitialValues) return;

    limparDados();
    if (ueCodigo) obterModalidades();
  }, [ueCodigo]);

  const setarNovoValor = newValue => {
    form.setFieldValue(name, newValue || '');
    form.setFieldTouched(name, true, true);
  };

  return (
    <Loader loading={exibirLoader} ignorarTip>
      <SelectComponent
        name={name}
        form={form}
        label="Modalidade"
        valueOption="valor"
        valueText="descricao"
        multiple={multiple}
        showSearch={showSearch}
        lista={listaModalidades}
        id={SGP_SELECT_MODALIDADE}
        labelRequired={labelRequired}
        disabled={!ueCodigo || disabled || listaModalidades?.length === 1}
        placeholder="Selecione uma modalidade"
        setValueOnlyOnChange
        onChange={newValue => {
          form.setFieldValue('modoEdicao', true);

          if (multiple) {
            onchangeMultiSelect(newValue, form.values[name], setarNovoValor);
            onChange(newValue);
          } else {
            setarNovoValor(newValue);
            onChange(newValue);
          }
        }}
      />
    </Loader>
  );
};

Modalidade.propTypes = {
  name: PropTypes.string,
  disabled: PropTypes.bool,
  onChange: PropTypes.func,
  showSearch: PropTypes.bool,
  labelRequired: PropTypes.bool,
  mostrarOpcaoTodas: PropTypes.bool,
  form: PropTypes.oneOfType([PropTypes.any]),
  nameList: PropTypes.string,
  multiple: PropTypes.bool,
};

Modalidade.defaultProps = {
  form: null,
  disabled: false,
  showSearch: true,
  name: 'modalidade',
  labelRequired: true,
  onChange: () => null,
  mostrarOpcaoTodas: true,
  nameList: 'listaModalidades',
  multiple: false,
};
