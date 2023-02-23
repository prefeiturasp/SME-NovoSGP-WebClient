import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Loader, SelectComponent } from '~/componentes';
import { OPCAO_TODOS } from '~/constantes';
import { ModalidadeDTO } from '~/dtos';
import { setAlunosComunicados } from '~/redux/modulos/comunicados/actions';
import { erros, ServicoComunicados } from '~/servicos';
import { onchangeMultiSelect } from '~/utils';

const TurmasComunicados = ({ form, onChangeCampos, desabilitar }) => {
  const [exibirLoader, setExibirLoader] = useState(false);
  const [listaTurmas, setListaTurmas] = useState([]);

  const {
    anoLetivo,
    codigoUe,
    modalidades,
    semestre,
    anosEscolares,
    turmas,
  } = form.values;

  const dispatch = useDispatch();

  const ehTodasModalidade = modalidades?.find(item => item === OPCAO_TODOS);
  const ehTodasUe = codigoUe === OPCAO_TODOS;

  const temModalidadeEja = modalidades?.find(
    item => String(item) === String(ModalidadeDTO.EJA)
  );

  const nomeCampo = 'turmas';

  const obterTurmas = useCallback(async () => {
    const todasTurmas = { valor: OPCAO_TODOS, descricaoTurma: 'Todas' };

    // TODO ehTodasUe conflito no critério!
    if (ehTodasModalidade || ehTodasUe) {
      setListaTurmas([todasTurmas]);
      form.setFieldValue(nomeCampo, [OPCAO_TODOS]);
      return;
    }

    setExibirLoader(true);
    // TODO: VERIFICAR SOBRE O CONSIDERA HISTÓRICO!
    const retorno = await ServicoComunicados.obterTurmas(
      anoLetivo,
      codigoUe,
      semestre,
      modalidades,
      anosEscolares,
      false
    )
      .catch(e => erros(e))
      .finally(() => setExibirLoader(false));

    if (retorno?.data?.length) {
      const lista = retorno.data;

      if (retorno.data.length > 1) {
        lista.unshift(todasTurmas);
      }

      setListaTurmas(lista);
      if (lista.length === 1) {
        const { valor } = lista[0];
        form.setFieldValue(nomeCampo, [valor]);
      }
    } else {
      setListaTurmas([]);
      form.setFieldValue(nomeCampo, []);
    }

  }, [
    anoLetivo,
    codigoUe,
    semestre,
    modalidades,
    anosEscolares,
    ehTodasModalidade,
    ehTodasUe,
  ]);

  useEffect(() => {
    if (anosEscolares?.length && codigoUe && modalidades) {
      obterTurmas();
    } else {
      setListaTurmas([]);
      form.setFieldValue(nomeCampo, []);
    }

  }, [anosEscolares, obterTurmas]);

  const onChangeAnosEscolares = novosValores => {
    form.setFieldValue(nomeCampo, novosValores || []);
    form.setFieldTouched(nomeCampo, true, true);
  };

  return (
    <Loader loading={exibirLoader} ignorarTip>
      <SelectComponent
        id="turma"
        label="Turma"
        lista={listaTurmas}
        valueOption="valor"
        valueText="descricaoTurma"
        disabled={
          !modalidades?.length ||
          listaTurmas?.length === 1 ||
          !listaTurmas?.length ||
          !anosEscolares?.length ||
          ehTodasModalidade ||
          (temModalidadeEja && !semestre) ||
          desabilitar
        }
        placeholder="Turma"
        showSearch
        multiple
        name={nomeCampo}
        form={form}
        setValueOnlyOnChange
        labelRequired
        onChange={valores => {
          onchangeMultiSelect(valores, turmas, onChangeAnosEscolares);
          onChangeCampos();
          form.setFieldValue('alunoEspecifico', undefined);
          form.setFieldValue('alunos', []);
          dispatch(setAlunosComunicados([]));
        }}
      />
    </Loader>
  );
};

TurmasComunicados.propTypes = {
  form: PropTypes.oneOfType([PropTypes.object]),
  onChangeCampos: PropTypes.func,
  desabilitar: PropTypes.bool,
};

TurmasComunicados.defaultProps = {
  form: null,
  onChangeCampos: () => null,
  desabilitar: false,
};

export default TurmasComunicados;
