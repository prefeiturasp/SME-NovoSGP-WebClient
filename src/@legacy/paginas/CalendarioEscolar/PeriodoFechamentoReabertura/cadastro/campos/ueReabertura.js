import PropTypes from 'prop-types';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Loader, SelectComponent } from '~/componentes';
import { OPCAO_TODOS } from '~/constantes';
import { AbrangenciaServico, erros, ServicoCalendarios } from '~/servicos';
import FechaReabCadastroContext from '../fechaReabCadastroContext';

const UeReabertura = ({ form, onChangeCampos }) => {
  const { setListaUes, listaUes, desabilitarCampos, calendarioSelecionado } =
    useContext(FechaReabCadastroContext);

  const paramsRota = useParams();

  const [exibirLoader, setExibirLoader] = useState(false);

  const { dreCodigo } = form.values;

  const nomeCampo = 'ueCodigo';

  const obterUes = useCallback(async () => {
    const ueTodos = { nome: 'Todas', codigo: OPCAO_TODOS };

    if (dreCodigo === OPCAO_TODOS) {
      form.setFieldValue(nomeCampo, OPCAO_TODOS);
      form.initialValues[nomeCampo] = OPCAO_TODOS;
      setListaUes([ueTodos]);
      return;
    }

    const modalidade = calendarioSelecionado?.modalidade
      ? ServicoCalendarios.converterModalidade(
          calendarioSelecionado?.modalidade
        )
      : '';

    setExibirLoader(true);
    const resposta = await AbrangenciaServico.buscarUes(
      dreCodigo,
      '',
      false,
      modalidade,
      calendarioSelecionado.anoLetivo < new Date().getFullYear(),
      calendarioSelecionado.anoLetivo
    )
      .catch(e => erros(e))
      .finally(() => setExibirLoader(false));

    if (resposta?.data?.length) {
      const lista = resposta.data;

      if (lista?.length === 1) {
        const { codigo } = lista[0];
        form.setFieldValue(nomeCampo, codigo);
        if (!paramsRota?.id) {
          form.initialValues.ueCodigo = codigo;
        }
      }

      setListaUes(lista);
    } else {
      form.setFieldValue(nomeCampo, undefined);
      setListaUes([]);
    }
  }, [dreCodigo, calendarioSelecionado, paramsRota]);

  useEffect(() => {
    if (
      (calendarioSelecionado?.id && dreCodigo) ||
      (!calendarioSelecionado?.id && dreCodigo && dreCodigo === OPCAO_TODOS)
    ) {
      obterUes();
    } else if (!dreCodigo) {
      form.setFieldValue(nomeCampo, undefined);
      setListaUes([]);
    }
  }, [dreCodigo, calendarioSelecionado, obterUes]);

  useEffect(() => {
    if (!calendarioSelecionado?.id && dreCodigo !== OPCAO_TODOS) {
      form.setFieldValue(nomeCampo, undefined);
      setListaUes([]);
    }
  }, [calendarioSelecionado]);

  return (
    <Loader loading={exibirLoader} ignorarTip>
      <SelectComponent
        id="codigo-ue"
        label="Unidade Escolar (UE)"
        lista={listaUes}
        valueOption="codigo"
        valueText="nome"
        disabled={!dreCodigo || listaUes?.length === 1 || desabilitarCampos}
        placeholder="Selecione uma UE"
        showSearch
        name={nomeCampo}
        form={form}
        onChange={() => {
          onChangeCampos();
        }}
        labelRequired
      />
    </Loader>
  );
};

UeReabertura.propTypes = {
  form: PropTypes.oneOfType([PropTypes.object]),
  onChangeCampos: PropTypes.func,
};

UeReabertura.defaultProps = {
  form: null,
  onChangeCampos: () => null,
};

export default UeReabertura;
