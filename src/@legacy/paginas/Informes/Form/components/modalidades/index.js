import PropTypes from 'prop-types';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Loader, SelectComponent } from '~/componentes';
import { OPCAO_TODOS } from '~/constantes';
import { SGP_SELECT_MODALIDADE } from '~/constantes/ids/select';
import { ServicoFiltroRelatorio, erros } from '~/servicos';
import { onchangeMultiSelect } from '~/utils';
import { temPerfisValidosCadstroInformes } from '../../utils';

export const SelectModalidadesInformes = ({
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
  const dreCodigo = form.values?.dreCodigo;
  const perfis = form.values?.perfis;
  const listaPerfis = form.values?.listaPerfis;

  const listaModalidades = form.values?.[nameList];

  const setInitialValues = !form?.values?.modoEdicao;

  const desabilitar = listaModalidades?.length === 1 || disabled;

  const OPCAO_TODAS_MODALIDADES = { valor: OPCAO_TODOS, descricao: 'Todas' };

  const limparDados = () => {
    form.setFieldValue(nameList, []);
    form.setFieldValue(name, undefined);
  };

  const obterDados = useCallback(async () => {
    if (ueCodigo !== OPCAO_TODOS) {
      return;
    }

    setExibirLoader(true);

    const retorno = await ServicoFiltroRelatorio.obterModalidadesPorAbrangencia(
      ueCodigo,
      true
    )
      .catch(e => erros(e))
      .finally(() => setExibirLoader(false));

    if (retorno?.data?.length) {
      const lista = retorno.data;

      if (lista.length === 1) {
        let valorAtual = String(lista[0]?.valor);
        valorAtual = multiple ? [valorAtual] : valorAtual;

        if (setInitialValues) {
          form.initialValues[name] = valorAtual;
        }
        form.setFieldValue(name, valorAtual);
      } else if (mostrarOpcaoTodas) {
        lista.unshift(OPCAO_TODAS_MODALIDADES);
      }

      if (setInitialValues) {
        form.initialValues[nameList] = lista;
      }
      form.setFieldValue(nameList, lista);
    } else {
      limparDados();
    }
  }, [ueCodigo]);

  const temPerfisValidos = useMemo(() => {
    if (ueCodigo === OPCAO_TODOS)
      return temPerfisValidosCadstroInformes(listaPerfis, perfis);

    return false;
  }, [perfis, listaPerfis, ueCodigo]);

  useEffect(() => {
    limparDados();

    if (temPerfisValidos) {
      obterDados();
    }
  }, [temPerfisValidos]);

  useEffect(() => {
    limparDados();

    if (ueCodigo && ueCodigo !== OPCAO_TODOS) {
      form.setFieldValue(nameList, [OPCAO_TODAS_MODALIDADES]);
      form.setFieldValue(name, multiple ? [OPCAO_TODOS] : OPCAO_TODOS);
    }
  }, [dreCodigo, ueCodigo]);

  const setarNovoValor = newValue => {
    form.setFieldValue(name, newValue || '');
    form.setFieldTouched(name, true, true);
  };

  return (
    <Loader loading={exibirLoader} ignorarTip>
      <SelectComponent
        form={form}
        name={name}
        label="Modalidade"
        placeholder="Modalidade"
        multiple={multiple}
        lista={listaModalidades}
        id={SGP_SELECT_MODALIDADE}
        valueOption="valor"
        valueText="descricao"
        disabled={desabilitar || !temPerfisValidos}
        showSearch={showSearch}
        labelRequired={labelRequired && temPerfisValidos}
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

SelectModalidadesInformes.propTypes = {
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

SelectModalidadesInformes.defaultProps = {
  form: null,
  name: 'modalidade',
  disabled: false,
  multiple: false,
  showSearch: false,
  labelRequired: false,
  onChange: () => null,
  mostrarOpcaoTodas: true,
  nameList: 'listaModalidades',
};
