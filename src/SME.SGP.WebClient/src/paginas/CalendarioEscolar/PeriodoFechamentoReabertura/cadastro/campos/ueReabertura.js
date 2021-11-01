import PropTypes from 'prop-types';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Loader, SelectComponent } from '~/componentes';
import { OPCAO_TODOS } from '~/constantes';
import { AbrangenciaServico, erros, ServicoCalendarios } from '~/servicos';
import FechaReabCadastroContext from '../fechaReabCadastroContext';

const UeReabertura = ({ form, onChangeCampos }) => {
  const {
    setListaUes,
    listaUes,
    desabilitarCampos,
    calendarioSelecionado,
  } = useContext(FechaReabCadastroContext);

  const paramsRota = useParams();

  const usuario = useSelector(store => store.usuario);
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
      modalidade
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

      if (usuario.possuiPerfilSmeOuDre && lista?.length > 1) {
        lista.unshift(ueTodos);

        if (!paramsRota?.id) {
          if (dreCodigo && dreCodigo !== OPCAO_TODOS) {
            form.setFieldValue(nomeCampo, OPCAO_TODOS);
            form.initialValues.ueCodigo = OPCAO_TODOS;
          }
        }
      }

      setListaUes(lista);
    } else {
      form.setFieldValue(nomeCampo, undefined);
      setListaUes([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dreCodigo, calendarioSelecionado, obterUes]);

  useEffect(() => {
    if (!calendarioSelecionado?.id && dreCodigo !== OPCAO_TODOS) {
      form.setFieldValue(nomeCampo, undefined);
      setListaUes([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
