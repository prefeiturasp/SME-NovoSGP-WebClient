import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Loader, SelectComponent } from '~/componentes';
import { OPCAO_TODOS } from '~/constantes';
import { setAlunosComunicados } from '~/redux/modulos/comunicados/actions';
import { AbrangenciaServico, erros } from '~/servicos';

const UeComunicados = ({ form, onChangeCampos, desabilitar }) => {
  const [exibirLoader, setExibirLoader] = useState(false);
  const [listaUes, setListaUes] = useState([]);

  const { anoLetivo, codigoDre } = form.values;

  const nomeCampo = 'codigoUe';

  const dispatch = useDispatch();

  const obterUes = useCallback(async () => {
    const ueTodos = { nome: 'Todas', codigo: OPCAO_TODOS };

    if (codigoDre === OPCAO_TODOS) {
      setListaUes([ueTodos]);
      form.setFieldValue(nomeCampo, OPCAO_TODOS);
      form.initialValues[nomeCampo] = OPCAO_TODOS;
      return;
    }

    setExibirLoader(true);
    const resposta = await AbrangenciaServico.buscarUes(
      codigoDre,
      `v1/abrangencias/false/dres/${codigoDre}/ues?anoLetivo=${anoLetivo}&consideraNovasUEs=${true}`,
      true
    )
      .catch(e => erros(e))
      .finally(() => setExibirLoader(false));

    if (resposta?.data?.length) {
      const lista = resposta.data;

      if (lista?.length === 1) {
        const { codigo } = lista[0];
        form.setFieldValue(nomeCampo, codigo);
      } else {
        lista.unshift(ueTodos);
      }

      setListaUes(lista);
    } else {
      form.initialValues[nomeCampo] = undefined;
      setListaUes([]);
    }
  }, [anoLetivo, codigoDre]);

  useEffect(() => {
    if (codigoDre) {
      obterUes();
    } else {
      form.setFieldValue(nomeCampo, undefined);
      setListaUes([]);
    }
  }, [codigoDre, obterUes]);

  return (
    <Loader loading={exibirLoader} ignorarTip>
      <SelectComponent
        id="codigo-ue"
        label="Unidade Escolar (UE)"
        lista={listaUes}
        valueOption="codigo"
        valueText="nome"
        disabled={!codigoDre || listaUes?.length === 1 || desabilitar}
        placeholder="Unidade Escolar (UE)"
        showSearch
        name={nomeCampo}
        form={form}
        labelRequired
        onChange={() => {
          onChangeCampos();
          form.setFieldValue('modalidades', []);
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

UeComunicados.propTypes = {
  form: PropTypes.oneOfType([PropTypes.object]),
  onChangeCampos: PropTypes.func,
  desabilitar: PropTypes.bool,
};

UeComunicados.defaultProps = {
  form: null,
  onChangeCampos: () => null,
  desabilitar: false,
};

export default UeComunicados;
