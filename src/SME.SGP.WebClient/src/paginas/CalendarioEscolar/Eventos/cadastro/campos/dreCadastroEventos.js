import PropTypes from 'prop-types';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Loader, SelectComponent } from '~/componentes';
import { FiltroHelper } from '~/componentes-sgp';
import { OPCAO_TODOS } from '~/constantes';
import { AbrangenciaServico, erros } from '~/servicos';
import EventosCadastroContext from '../eventosCadastroContext';

const DreCadastroEventos = ({
  form,
  onChangeCampos,
  desabilitar,
  eventoId,
}) => {
  const { setListaDres, listaDres } = useContext(EventosCadastroContext);

  const usuario = useSelector(store => store.usuario);
  const [exibirLoader, setExibirLoader] = useState(false);

  const { dreId } = form.values;

  const nomeCampo = 'dreId';

  const obterDres = useCallback(async () => {
    setExibirLoader(true);
    const resposta = await AbrangenciaServico.buscarDres()
      .catch(e => erros(e))
      .finally(() => setExibirLoader(false));

    if (resposta?.data?.length) {
      const lista = resposta.data.sort(FiltroHelper.ordenarLista('nome'));

      if (lista?.length === 1) {
        const { codigo } = lista[0];

        if (!eventoId) {
          form.setFieldValue('dreId', codigo);
          form.initialValues.dreId = codigo;
        }
      }

      if (usuario.possuiPerfilSme && lista?.length > 1) {
        lista.unshift({ codigo: OPCAO_TODOS, nome: 'Todas' });
        if (!eventoId) {
          form.setFieldValue('dreId', OPCAO_TODOS);
          form.initialValues.dreId = OPCAO_TODOS;
        }
      }
      setListaDres(lista);
    } else {
      form.setFieldValue('dreId', undefined);
      setListaDres([]);
    }
  }, [eventoId, usuario.possuiPerfilSme]);

  useEffect(() => {
    if (!eventoId || (eventoId && dreId)) {
      obterDres();
    }
  }, [obterDres]);

  return (
    <Loader loading={exibirLoader} ignorarTip>
      <SelectComponent
        id="codigo-dre"
        label="Diretoria Regional de Educação (DRE)"
        lista={listaDres}
        valueOption="codigo"
        valueText="nome"
        disabled={listaDres?.length === 1 || desabilitar}
        placeholder="Selecione uma DRE"
        showSearch
        name={nomeCampo}
        form={form}
        onChange={dre => {
          onChangeCampos(dre);
        }}
      />
    </Loader>
  );
};

DreCadastroEventos.propTypes = {
  form: PropTypes.oneOfType([PropTypes.object]),
  onChangeCampos: PropTypes.func,
  desabilitar: PropTypes.bool,
  eventoId: PropTypes.number,
};

DreCadastroEventos.defaultProps = {
  form: null,
  onChangeCampos: () => null,
  desabilitar: false,
  eventoId: 0,
};

export default DreCadastroEventos;
