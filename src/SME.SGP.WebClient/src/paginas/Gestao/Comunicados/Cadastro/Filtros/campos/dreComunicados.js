import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Loader, SelectComponent } from '~/componentes';
import { FiltroHelper } from '~/componentes-sgp';
import { OPCAO_TODOS } from '~/constantes';
import { setAlunosComunicados } from '~/redux/modulos/comunicados/actions';
import { AbrangenciaServico, erros } from '~/servicos';

const DreComunicados = ({
  form,
  onChangeCampos,
  desabilitar,
  comunicadoId,
}) => {
  const [exibirLoader, setExibirLoader] = useState(false);
  const [listaDres, setListaDres] = useState([]);

  const { anoLetivo } = form.values;

  const nomeCampo = 'codigoDre';

  const dispatch = useDispatch();

  const obterDres = useCallback(async () => {
    setExibirLoader(true);
    const resposta = await AbrangenciaServico.buscarDres(
      `v1/abrangencias/false/dres?anoLetivo=${anoLetivo}`
    )
      .catch(e => erros(e))
      .finally(() => setExibirLoader(false));

    if (resposta?.data?.length) {
      const lista = resposta.data.sort(FiltroHelper.ordenarLista('nome'));

      if (lista?.length === 1) {
        const { codigo } = lista[0];

        form.setFieldValue(nomeCampo, codigo);
        if (!comunicadoId) {
          form.initialValues[nomeCampo] = codigo;
        }
      } else {
        lista.unshift({ codigo: OPCAO_TODOS, nome: 'Todas' });
      }
      setListaDres(lista);
    } else {
      form.setFieldValue(nomeCampo, undefined);
      setListaDres([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [anoLetivo]);

  useEffect(() => {
    if (anoLetivo) {
      obterDres();
    } else {
      form.setFieldValue(nomeCampo, undefined);
      setListaDres([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [anoLetivo, obterDres]);

  return (
    <Loader loading={exibirLoader} ignorarTip>
      <SelectComponent
        id="codigo-dre"
        label="Diretoria Regional de Educação (DRE)"
        lista={listaDres}
        valueOption="codigo"
        valueText="nome"
        disabled={!anoLetivo || listaDres?.length === 1 || desabilitar}
        placeholder="Diretoria Regional De Educação (DRE)"
        showSearch
        name={nomeCampo}
        form={form}
        labelRequired
        onChange={() => {
          onChangeCampos();
          form.setFieldValue('codigoUe', undefined);
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

DreComunicados.propTypes = {
  form: PropTypes.oneOfType([PropTypes.object]),
  onChangeCampos: PropTypes.func,
  desabilitar: PropTypes.bool,
  comunicadoId: PropTypes.string,
};

DreComunicados.defaultProps = {
  form: null,
  onChangeCampos: () => null,
  desabilitar: false,
  comunicadoId: '',
};

export default DreComunicados;
