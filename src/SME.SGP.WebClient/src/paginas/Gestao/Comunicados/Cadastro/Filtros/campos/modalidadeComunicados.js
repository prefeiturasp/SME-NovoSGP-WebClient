import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Loader, SelectComponent } from '~/componentes';
import { OPCAO_TODOS } from '~/constantes';
import {
  setAlunosComunicados,
  setListaModalidadesComunicados,
} from '~/redux/modulos/comunicados/actions';
import { ServicoFiltroRelatorio } from '~/servicos';
import { onchangeMultiSelect } from '~/utils';

const ModalidadeComunicados = ({ form, onChangeCampos, desabilitar }) => {
  const [exibirLoader, setExibirLoader] = useState(false);

  const listaModalidadesComunicados = useSelector(
    store => store.comunicados?.listaModalidadesComunicados
  );

  const dispatch = useDispatch();

  const { codigoUe, modalidades } = form.values;

  const nomeCampo = 'modalidades';

  const obterModalidades = useCallback(async () => {
    setExibirLoader(true);
    const resposta = await ServicoFiltroRelatorio.obterModalidadesPorAbrangencia(
      codigoUe,
      true
    ).finally(() => setExibirLoader(false));

    if (resposta?.data?.length) {
      const lista = resposta.data;

      if (lista?.length === 1) {
        const { valor } = lista[0];
        form.setFieldValue(nomeCampo, [valor]);
      } else {
        lista.unshift({
          descricao: 'Todas',
          valor: OPCAO_TODOS,
        });
      }
      dispatch(setListaModalidadesComunicados(lista));
    } else {
      form.setFieldValue(nomeCampo, []);
      dispatch(setListaModalidadesComunicados([]));
    }
  }, [codigoUe]);

  useEffect(() => {
    if (codigoUe) {
      obterModalidades();
    } else {
      form.setFieldValue(nomeCampo, []);
      dispatch(setListaModalidadesComunicados([]));
    }
  }, [codigoUe, obterModalidades]);

  useEffect(() => {
    return () => {
      dispatch(setListaModalidadesComunicados([]));
    };
  }, [dispatch]);

  const onChangeModalidade = novosValores => {
    form.setFieldValue(nomeCampo, novosValores || []);
    form.setFieldTouched(nomeCampo, true, true);
  };

  return (
    <Loader loading={exibirLoader} ignorarTip>
      <SelectComponent
        id="modalidades"
        label="Modalidade"
        lista={listaModalidadesComunicados}
        valueOption="valor"
        valueText="descricao"
        disabled={
          !codigoUe || listaModalidadesComunicados?.length === 1 || desabilitar
        }
        placeholder="Modalidade"
        multiple
        name={nomeCampo}
        form={form}
        setValueOnlyOnChange
        onChange={valores => {
          onchangeMultiSelect(valores, modalidades, onChangeModalidade);
          onChangeCampos();
          form.setFieldValue('semestre', undefined);
          form.setFieldValue('tipoEscola', []);
          form.setFieldValue('anosEscolares', []);
          form.setFieldValue('turmas', []);
          form.setFieldValue('alunoEspecifico', undefined);
          form.setFieldValue('alunos', []);
          form.setFieldValue('tipoCalendarioId', undefined);
          form.setFieldValue('eventoId', undefined);
          dispatch(setAlunosComunicados([]));
        }}
      />
    </Loader>
  );
};

ModalidadeComunicados.propTypes = {
  form: PropTypes.oneOfType([PropTypes.object]),
  onChangeCampos: PropTypes.func,
  desabilitar: PropTypes.bool,
};

ModalidadeComunicados.defaultProps = {
  form: null,
  onChangeCampos: () => null,
  desabilitar: false,
};

export default ModalidadeComunicados;
