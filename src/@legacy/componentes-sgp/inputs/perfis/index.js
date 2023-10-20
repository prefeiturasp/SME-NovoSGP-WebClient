import { TipoPerfil } from '@/core/enum/tipo-perfil-enum';
import { obterPerfisPorTipoPerfil } from '@/core/services/informes-service';
import PropTypes from 'prop-types';
import { useCallback, useEffect, useState } from 'react';
import { Loader, SelectComponent } from '~/componentes';
import { OPCAO_TODOS } from '~/constantes';
import { SGP_SELECT_PERFIS } from '~/constantes/ids/select';
import { erros } from '~/servicos';
import { onchangeMultiSelect } from '~/utils';

export const SelectPerfis = ({
  name,
  form,
  onChange,
  disabled,
  multiple,
  showSearch,
  labelRequired,
  mostrarOpcaoTodas,
  nameList,
}) => {
  const [exibirLoader, setExibirLoader] = useState(false);

  const ueCodigo = form.values?.ueCodigo;
  const dreCodigo = form.values?.ueCodigo;

  const listaPerfis = form.values?.[nameList];

  const setInitialValues = !form?.values?.modoEdicao;

  const limparDados = () => {
    form.setFieldValue(nameList, []);
    form.setFieldValue(name, undefined);
  };

  const obterDados = useCallback(async () => {
    const OPCAO_TODOS_PERFIS = { id: OPCAO_TODOS, nome: 'Todos' };

    if (ueCodigo === OPCAO_TODOS) {
      const codigoAtual = multiple ? [OPCAO_TODOS] : OPCAO_TODOS;

      form.setFieldValue(nameList, [OPCAO_TODOS_PERFIS]);
      form.setFieldValue(name, codigoAtual);
      return;
    }

    setExibirLoader(true);

    let tipoPerfilConsulta = 0;

    if (dreCodigo === OPCAO_TODOS && ueCodigo === OPCAO_TODOS) {
      tipoPerfilConsulta = TipoPerfil.SME;
    }

    if (dreCodigo !== OPCAO_TODOS && ueCodigo === OPCAO_TODOS) {
      tipoPerfilConsulta = TipoPerfil.DRE;
    }

    if (dreCodigo !== OPCAO_TODOS && ueCodigo !== OPCAO_TODOS) {
      tipoPerfilConsulta = TipoPerfil.UE;
    }

    const retorno = await obterPerfisPorTipoPerfil(tipoPerfilConsulta)
      .catch(e => erros(e))
      .finally(() => setExibirLoader(false));

    if (retorno?.data?.length) {
      const lista = retorno.data;

      if (lista.length === 1) {
        let idAtual = String(lista[0]?.id);
        idAtual = multiple ? [idAtual] : idAtual;

        if (setInitialValues) {
          form.initialValues[name] = idAtual;
        }
        form.setFieldValue(name, idAtual);
      } else if (mostrarOpcaoTodas) {
        lista.unshift(OPCAO_TODOS_PERFIS);
      }

      if (setInitialValues) {
        form.initialValues[nameList] = lista;
      }
      form.setFieldValue(nameList, lista);
    } else {
      limparDados();
    }
  }, [dreCodigo, ueCodigo]);

  useEffect(() => {
    if (form.initialValues[nameList]?.length && setInitialValues) return;

    limparDados();
    if (dreCodigo && ueCodigo) obterDados();
  }, [dreCodigo, ueCodigo]);

  const desabilitar = listaPerfis?.length === 1 || disabled;

  const setarNovoValor = newValue => {
    form.setFieldValue(name, newValue || '');
    form.setFieldTouched(name, true, true);
  };

  return (
    <Loader loading={exibirLoader} ignorarTip>
      <SelectComponent
        form={form}
        name={name}
        label="Perfil"
        placeholder="Perfil"
        multiple={multiple}
        lista={listaPerfis}
        id={SGP_SELECT_PERFIS}
        valueOption="id"
        valueText="nome"
        disabled={desabilitar}
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

SelectPerfis.propTypes = {
  name: PropTypes.string,
  disabled: PropTypes.bool,
  multiple: PropTypes.bool,
  onChange: PropTypes.func,
  showSearch: PropTypes.bool,
  labelRequired: PropTypes.bool,
  mostrarOpcaoTodas: PropTypes.bool,
  form: PropTypes.oneOfType([PropTypes.any]),
  nameList: PropTypes.string,
};

SelectPerfis.defaultProps = {
  form: null,
  name: 'perfis',
  disabled: false,
  multiple: false,
  showSearch: false,
  labelRequired: false,
  onChange: () => null,
  mostrarOpcaoTodas: true,
  nameList: 'listaPerfis',
};
