import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Loader, SelectComponent } from '~/componentes';
import { OPCAO_TODOS } from '~/constantes';
import { ModalidadeDTO } from '~/dtos';
import { setAlunosComunicados } from '~/redux/modulos/comunicados/actions';
import { erros, ServicoComunicados } from '~/servicos';
import { onchangeMultiSelect } from '~/utils';

const AnoEscolarComunicados = ({ form, onChangeCampos, desabilitar }) => {
  const [exibirLoader, setExibirLoader] = useState(false);
  const [listaAnosEscolares, setListaAnosEscolares] = useState([]);

  const { codigoUe, modalidades, semestre, anosEscolares } = form.values;

  const ehTodasModalidade = modalidades?.find(item => item === OPCAO_TODOS);
  const temModalidadeEja = modalidades?.find(
    item => String(item) === String(ModalidadeDTO.EJA)
  );

  const dispatch = useDispatch();

  const nomeCampo = 'anosEscolares';

  const obterAnosEscolares = useCallback(async () => {
    const todosAnosEscolares = {
      ano: OPCAO_TODOS,
      descricao: 'Todos',
    };
    if (ehTodasModalidade) {
      setListaAnosEscolares([todosAnosEscolares]);
      form.setFieldValue(nomeCampo, [OPCAO_TODOS]);
      return;
    }

    setExibirLoader(true);
    const resposta = await ServicoComunicados.buscarAnosPorModalidade(
      modalidades,
      codigoUe
    )
      .catch(e => erros(e))
      .finally(() => setExibirLoader(false));

    if (resposta?.data?.length) {
      const lista = resposta.data;

      if (lista?.length === 1) {
        const { ano } = lista[0];
        form.setFieldValue(nomeCampo, [ano]);
      }

      if (lista?.length > 1) {
        lista.unshift(todosAnosEscolares);
      }
      setListaAnosEscolares(lista);
    } else {
      setListaAnosEscolares([]);
      form.setFieldValue(nomeCampo, []);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modalidades, codigoUe, ehTodasModalidade]);

  useEffect(() => {
    if (modalidades?.length) {
      obterAnosEscolares();
    } else {
      setListaAnosEscolares([]);
      form.setFieldValue(nomeCampo, []);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [obterAnosEscolares, modalidades]);

  const onChangeAnosEscolares = novosValores => {
    form.setFieldValue(nomeCampo, novosValores || []);
    form.setFieldTouched(nomeCampo, true, true);
  };

  return (
    <Loader loading={exibirLoader} ignorarTip>
      <SelectComponent
        id="anos-escolares"
        lista={listaAnosEscolares}
        valueOption="ano"
        valueText="descricao"
        label="Ano"
        disabled={
          !modalidades?.length ||
          listaAnosEscolares?.length === 1 ||
          (temModalidadeEja && !semestre) ||
          desabilitar
        }
        placeholder="Selecione o ano"
        showSearch
        multiple
        name={nomeCampo}
        form={form}
        setValueOnlyOnChange
        labelRequired
        onChange={valores => {
          onchangeMultiSelect(valores, anosEscolares, onChangeAnosEscolares);
          onChangeCampos();
          form.setFieldValue('turmas', []);
          form.setFieldValue('alunoEspecifico', undefined);
          form.setFieldValue('alunos', []);
          dispatch(setAlunosComunicados([]));
        }}
      />
    </Loader>
  );
};

AnoEscolarComunicados.propTypes = {
  form: PropTypes.oneOfType([PropTypes.object]),
  onChangeCampos: PropTypes.func,
  desabilitar: PropTypes.bool,
};

AnoEscolarComunicados.defaultProps = {
  form: null,
  onChangeCampos: () => null,
  desabilitar: false,
};

export default AnoEscolarComunicados;
