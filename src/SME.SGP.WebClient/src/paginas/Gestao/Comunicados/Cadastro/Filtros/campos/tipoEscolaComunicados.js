import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Loader, SelectComponent } from '~/componentes';
import { OPCAO_TODOS } from '~/constantes';
import { setAlunosComunicados } from '~/redux/modulos/comunicados/actions';
import { erros, ServicoComunicados } from '~/servicos';
import { onchangeMultiSelect } from '~/utils';

const TipoEscolaComunicados = ({ form, onChangeCampos, desabilitar }) => {
  const usuario = useSelector(store => store.usuario);

  const [exibirLoader, setExibirLoader] = useState(false);
  const [listaTipoEscola, setListaTipoEscola] = useState([]);

  const { codigoDre, codigoUe, tipoEscola } = form.values;

  const dispatch = useDispatch();

  const nomeCampo = 'tipoEscola';

  const obterTiposEscola = useCallback(async () => {
    setExibirLoader(true);
    const resposta = await ServicoComunicados.obterTipoEscola(
      codigoDre,
      codigoUe
    )
      .catch(e => erros(e))
      .finally(() => setExibirLoader(false));

    if (resposta?.data?.length) {
      const lista = resposta.data.map(item => ({
        valor: String(item.codTipoEscola),
        desc: item.descricao,
        id: item.id,
      }));

      if (usuario.possuiPerfilSmeOuDre && lista?.length > 1) {
        lista.unshift({
          valor: OPCAO_TODOS,
          desc: 'Todas',
        });
        form.setFieldValue(nomeCampo, [OPCAO_TODOS]);
      }

      setListaTipoEscola(lista);

      if (lista?.length === 1) {
        const { valor } = lista[0];
        form.setFieldValue(nomeCampo, [valor]);
      }
    } else {
      form.setFieldValue(nomeCampo, []);
      setListaTipoEscola([]);
    }
  }, [codigoDre, codigoUe]);

  useEffect(() => {
    if (codigoUe) {
      obterTiposEscola();
    } else {
      form.setFieldValue(nomeCampo, []);
      setListaTipoEscola([]);
    }
  }, [codigoUe, obterTiposEscola]);

  const onChangeTipoEscola = novosValores => {
    form.setFieldValue(nomeCampo, novosValores || []);
    form.setFieldTouched(nomeCampo, true, true);
  };

  return (
    <Loader loading={exibirLoader} ignorarTip>
      <SelectComponent
        id="tipo-escola"
        label="Tipo de escola"
        lista={listaTipoEscola}
        valueOption="valor"
        valueText="desc"
        disabled={
          !listaTipoEscola?.length ||
          listaTipoEscola?.length === 1 ||
          desabilitar
        }
        placeholder="Selecione o tipo de escola"
        showSearch
        multiple
        name={nomeCampo}
        form={form}
        setValueOnlyOnChange
        onChange={valores => {
          onchangeMultiSelect(valores, tipoEscola, onChangeTipoEscola);
          onChangeCampos();
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

TipoEscolaComunicados.propTypes = {
  form: PropTypes.oneOfType([PropTypes.object]),
  onChangeCampos: PropTypes.func,
  desabilitar: PropTypes.bool,
};

TipoEscolaComunicados.defaultProps = {
  form: null,
  onChangeCampos: () => null,
  desabilitar: false,
};

export default TipoEscolaComunicados;
