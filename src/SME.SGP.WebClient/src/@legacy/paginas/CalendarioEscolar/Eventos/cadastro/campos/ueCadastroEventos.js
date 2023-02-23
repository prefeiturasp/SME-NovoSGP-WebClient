import PropTypes from 'prop-types';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Loader, SelectComponent } from '~/componentes';
import { OPCAO_TODOS } from '~/constantes';
import { AbrangenciaServico, erros, ServicoCalendarios } from '~/servicos';
import EventosCadastroContext from '../eventosCadastroContext';

const UeCadastroEventos = ({ form, onChangeCampos, desabilitar, eventoId }) => {
  const { listaCalendarios, setListaUes, listaUes } = useContext(
    EventosCadastroContext
  );

  const usuario = useSelector(store => store.usuario);
  const [exibirLoader, setExibirLoader] = useState(false);

  const { dreId, tipoCalendarioId } = form.values;

  const nomeCampo = 'ueId';

  const obterUes = useCallback(async () => {
    const ueTodos = { nome: 'Todas', codigo: OPCAO_TODOS };

    if (dreId === OPCAO_TODOS) {
      form.setFieldValue(nomeCampo, OPCAO_TODOS);
      form.initialValues[nomeCampo] = OPCAO_TODOS;
      setListaUes([ueTodos]);
      return;
    }

    const calendarioSelecionado = listaCalendarios?.find(
      item => item?.id === form?.values?.tipoCalendarioId
    );

    const modalidade = calendarioSelecionado?.modalidade
      ? ServicoCalendarios.converterModalidade(
          calendarioSelecionado?.modalidade
        )
      : '';

    setExibirLoader(true);
    const resposta = await AbrangenciaServico.buscarUes(
      dreId,
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
        if (!eventoId) {
          form.initialValues.ueId = codigo;
        }
      }

      if (usuario.possuiPerfilSmeOuDre && lista?.length > 1) {
        lista.unshift(ueTodos);

        if (!eventoId) {
          if (dreId && dreId !== OPCAO_TODOS) {
            form.setFieldValue(nomeCampo, OPCAO_TODOS);
            form.initialValues.ueId = OPCAO_TODOS;
          }
        }
      }

      setListaUes(lista);
    } else {
      form.setFieldValue(nomeCampo, undefined);
      setListaUes([]);
    }

  }, [dreId, eventoId, listaCalendarios]);

  useEffect(() => {
    if (tipoCalendarioId && dreId && listaCalendarios?.length) {
      obterUes();
    } else if (!dreId) {
      form.setFieldValue(nomeCampo, undefined);
      setListaUes([]);
    }

  }, [dreId, obterUes]);

  return (
    <Loader loading={exibirLoader} ignorarTip>
      <SelectComponent
        id="codigo-ue"
        label="Unidade Escolar (UE)"
        lista={listaUes}
        valueOption="codigo"
        valueText="nome"
        disabled={!dreId || listaUes?.length === 1 || desabilitar}
        placeholder="Selecione uma UE"
        showSearch
        name={nomeCampo}
        form={form}
        onChange={ue => {
          onChangeCampos(ue);
        }}
        labelRequired
      />
    </Loader>
  );
};

UeCadastroEventos.propTypes = {
  form: PropTypes.oneOfType([PropTypes.object]),
  onChangeCampos: PropTypes.func,
  desabilitar: PropTypes.bool,
  eventoId: PropTypes.number,
};

UeCadastroEventos.defaultProps = {
  form: null,
  onChangeCampos: () => null,
  desabilitar: false,
  eventoId: 0,
};

export default UeCadastroEventos;
