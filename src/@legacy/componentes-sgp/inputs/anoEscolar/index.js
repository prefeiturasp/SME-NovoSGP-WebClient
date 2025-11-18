import { ModalidadeEnum } from '@/core/enum/modalidade-enum';
import PropTypes from 'prop-types';
import { useCallback, useEffect, useState } from 'react';
import { Loader, SelectComponent } from '~/componentes';
import { OPCAO_TODOS } from '~/constantes';
import { SGP_SELECT_ANO_ESCOLAR } from '~/constantes/ids/select';
import { AbrangenciaServico, erros } from '~/servicos';
import { onchangeMultiSelect } from '~/utils';

export const AnoEscolar = ({
  name,
  form,
  onChange,
  disabled,
  multiple,
  showSearch,
  labelRequired,
  mostrarOpcaoTodas,
  nameList,
  validarSemestre,
}) => {
  const [exibirLoader, setExibirLoader] = useState(false);

  const { anoLetivo, ueCodigo, modalidade, semestre } = form.values;
  const consideraHistorico = !!form.values?.consideraHistorico;
  const listaAnosEscolares = form.values?.[nameList];

  const setInitialValues = !form?.values?.modoEdicao;

  const modalidadeMultiplas = Array.isArray(modalidade);

  let ehEJAouCelp =
    Number(modalidade) === ModalidadeEnum.EJA ||
    Number(modalidade) === ModalidadeEnum.CELP;

  if (modalidadeMultiplas) {
    ehEJAouCelp = !!modalidade.find(
      valor =>
        Number(valor) === ModalidadeEnum.EJA ||
        Number(valor) === ModalidadeEnum.CELP
    );
  }

  const limparDados = () => {
    form.setFieldValue(nameList, []);
    form.setFieldValue(name, undefined);
  };

  const obterAnosEscolares = useCallback(async () => {
    const semModalidadeSelecionada =
      (modalidadeMultiplas && !modalidade?.length) || !modalidade;

    if (!anoLetivo || !ueCodigo || semModalidadeSelecionada) return;

    if (validarSemestre && ehEJAouCelp && !semestre) return;

    const OPCAO_TODOS_ANOS = { valor: OPCAO_TODOS, descricao: 'Todos' };

    const modalidadeEhTodos =
      modalidade === OPCAO_TODOS ||
      (modalidadeMultiplas && modalidade?.[0] === OPCAO_TODOS);

    const maisDeUmaModalidadeSelecionada =
      modalidadeMultiplas && modalidade?.length > 1;

    if (modalidadeEhTodos || maisDeUmaModalidadeSelecionada) {
      const codigoAtual = multiple ? [OPCAO_TODOS] : OPCAO_TODOS;

      form.setFieldValue(nameList, [OPCAO_TODOS_ANOS]);
      form.setFieldValue(name, codigoAtual);
      return;
    }

    setExibirLoader(true);

    const modalidadeConsulta = modalidadeMultiplas
      ? modalidade?.[0]
      : modalidade;

    const retorno = await AbrangenciaServico.buscarAnosEscolares(
      ueCodigo,
      modalidadeConsulta,
      consideraHistorico,
      anoLetivo
    )
      .catch(e => erros(e))
      .finally(() => setExibirLoader(false));

    if (retorno?.data?.length) {
      const lista = retorno.data;

      if (lista.length === 1) {
        let codigoAtual = String(lista[0]?.valor);
        codigoAtual = multiple ? [codigoAtual] : codigoAtual;

        if (setInitialValues) {
          form.initialValues[name] = codigoAtual;
        }
        form.setFieldValue(name, codigoAtual);
      } else if (mostrarOpcaoTodas) {
        lista.unshift(OPCAO_TODOS_ANOS);
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

    let carregarDados = false;

    if (modalidadeMultiplas) {
      carregarDados = modalidade?.length > 0;
    } else {
      carregarDados = !!modalidade;
    }

    if (carregarDados) obterAnosEscolares();
  }, [modalidade, semestre]);

  const desabilitar =
    !modalidade ||
    (validarSemestre && ehEJAouCelp && !semestre) ||
    listaAnosEscolares?.length === 1 ||
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
        label="Ano"
        placeholder="Ano"
        multiple={multiple}
        lista={listaAnosEscolares}
        id={SGP_SELECT_ANO_ESCOLAR}
        valueOption="valor"
        valueText="descricao"
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

AnoEscolar.propTypes = {
  name: PropTypes.string,
  disabled: PropTypes.bool,
  multiple: PropTypes.bool,
  onChange: PropTypes.func,
  showSearch: PropTypes.bool,
  labelRequired: PropTypes.bool,
  mostrarOpcaoTodas: PropTypes.bool,
  form: PropTypes.oneOfType([PropTypes.any]),
  nameList: PropTypes.string,
  validarSemestre: PropTypes.bool,
};

AnoEscolar.defaultProps = {
  form: null,
  name: 'anoCodigo',
  disabled: false,
  multiple: false,
  showSearch: false,
  labelRequired: true,
  onChange: () => null,
  mostrarOpcaoTodas: true,
  nameList: 'listaAnosEscolares',
  validarSemestre: true,
};
