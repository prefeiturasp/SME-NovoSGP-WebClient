import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useState } from 'react';
import { Loader, SelectComponent } from '~/componentes';
import { OPCAO_TODOS } from '~/constantes';
import { SGP_SELECT_TURMA } from '~/constantes/ids/select';
import { ModalidadeEnum } from '@/core/enum/modalidade-enum';
import { AbrangenciaServico, erros } from '~/servicos';
import { onchangeMultiSelect } from '~/utils';

export const Turma = ({
  name,
  form,
  onChange,
  disabled,
  multiple,
  showSearch,
  labelRequired,
  mostrarOpcaoTodas,
  nameList,
  selecionarTodasAoCarregar,
}) => {
  const [exibirLoader, setExibirLoader] = useState(false);

  const { anoLetivo, ueCodigo, modalidade, semestre } = form.values;
  const consideraHistorico = !!form.values?.consideraHistorico;
  const listaTurmas = form.values?.[nameList];

  const setInitialValues = !form?.values?.modoEdicao;

  const ehEJAouCelp =
    Number(modalidade) === ModalidadeEnum.EJA ||
    Number(modalidade) === ModalidadeEnum.CELP;

  const limparDados = () => {
    form.setFieldValue(nameList, []);
    form.setFieldValue(name, undefined);
  };

  const obterTurmas = useCallback(async () => {
    if (!anoLetivo || !ueCodigo || !modalidade) return;

    if (ehEJAouCelp && !semestre) return;

    const OPCAO_TODAS_TURMA = { codigo: OPCAO_TODOS, nomeFiltro: 'Todas' };

    if (ueCodigo === OPCAO_TODOS || selecionarTodasAoCarregar) {
      const codigoAtual = multiple ? [OPCAO_TODOS] : OPCAO_TODOS;

      form.setFieldValue(nameList, [OPCAO_TODAS_TURMA]);
      form.setFieldValue(name, codigoAtual);
      return;
    }

    setExibirLoader(true);

    const retorno = await AbrangenciaServico.buscarTurmas(
      ueCodigo,
      modalidade === OPCAO_TODOS ? '' : modalidade,
      semestre,
      anoLetivo,
      consideraHistorico
    )
      .catch(e => erros(e))
      .finally(() => setExibirLoader(false));

    if (retorno?.data?.length) {
      const lista = retorno.data;

      if (lista.length === 1) {
        let codigoAtual = String(lista[0]?.codigo);
        codigoAtual = multiple ? [codigoAtual] : codigoAtual;

        if (setInitialValues) {
          form.initialValues[name] = codigoAtual;
        }
        form.setFieldValue(name, codigoAtual);
      } else if (mostrarOpcaoTodas) {
        lista.unshift(OPCAO_TODAS_TURMA);
      }

      if (setInitialValues) {
        form.initialValues[nameList] = lista;
      }
      form.setFieldValue(nameList, lista);
    } else {
      limparDados();
    }
  }, [ueCodigo, modalidade, anoLetivo, consideraHistorico, semestre]);

  useEffect(() => {
    if (form.initialValues[nameList]?.length && setInitialValues) return;

    limparDados();
    if (modalidade) obterTurmas();
  }, [modalidade, semestre]);

  const desabilitar =
    !modalidade ||
    (ehEJAouCelp && !semestre) ||
    listaTurmas?.length === 1 ||
    disabled;

  const setarNovoValor = newValue => {
    form.setFieldValue(name, newValue || '');
    form.setFieldTouched(name, true, true);
  };

  return (
    <Loader loading={exibirLoader} ignorarTip>
      <SelectComponent
        form={form}
        name={name}
        label="Turma"
        placeholder="Turma"
        multiple={multiple}
        lista={listaTurmas}
        id={SGP_SELECT_TURMA}
        valueOption="codigo"
        valueText="nomeFiltro"
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

Turma.propTypes = {
  name: PropTypes.string,
  disabled: PropTypes.bool,
  multiple: PropTypes.bool,
  onChange: PropTypes.func,
  showSearch: PropTypes.bool,
  labelRequired: PropTypes.bool,
  mostrarOpcaoTodas: PropTypes.bool,
  form: PropTypes.oneOfType([PropTypes.any]),
  nameList: PropTypes.string,
  selecionarTodasAoCarregar: PropTypes.bool,
};

Turma.defaultProps = {
  form: null,
  name: 'turmaCodigo',
  disabled: false,
  multiple: false,
  showSearch: false,
  labelRequired: true,
  onChange: () => null,
  mostrarOpcaoTodas: true,
  nameList: 'listaTurmas',
  selecionarTodasAoCarregar: false,
};
