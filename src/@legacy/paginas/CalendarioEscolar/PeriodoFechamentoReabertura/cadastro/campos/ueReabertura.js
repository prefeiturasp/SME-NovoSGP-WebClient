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

  function mesclarAbrangencias(obj1, obj2) {
    const merged = {};

    for (const key in obj1) {
      // eslint-disable-next-line no-prototype-builtins
      if (obj1.hasOwnProperty(key)) {
        merged[key] = obj1[key];
      }
    }

    for (const key in obj2) {
      // eslint-disable-next-line no-prototype-builtins
      if (obj2.hasOwnProperty(key) && !merged.hasOwnProperty(key)) {
        merged[key] = obj2[key];
      }
    }

    return merged;
  }

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
      false,
      calendarioSelecionado.anoLetivo
    )
      .catch(e => erros(e))
      .finally(() => setExibirLoader(false));

    const respostaHistorica = await AbrangenciaServico.buscarUes(
      dreCodigo,
      '',
      false,
      modalidade,
      true,
      calendarioSelecionado.anoLetivo
    )
      .catch(e => erros(e))
      .finally(() => setExibirLoader(false));

    const dadosUes = Object.values(
      mesclarAbrangencias(resposta?.data, respostaHistorica?.data)
    );

    if (dadosUes?.length) {
      const lista = dadosUes;

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
