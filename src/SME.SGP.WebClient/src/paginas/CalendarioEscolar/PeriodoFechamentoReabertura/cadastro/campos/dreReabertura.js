import PropTypes from 'prop-types';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Loader, SelectComponent } from '~/componentes';
import { FiltroHelper } from '~/componentes-sgp';
import { OPCAO_TODOS } from '~/constantes';
import { AbrangenciaServico, erros } from '~/servicos';
import FechaReabCadastroContext from '../fechaReabCadastroContext';

const DreReabertura = ({ form, onChangeCampos }) => {
  const { setListaDres, listaDres, desabilitarCampos } = useContext(
    FechaReabCadastroContext
  );

  const paramsRota = useParams();

  const usuario = useSelector(store => store.usuario);
  const [exibirLoader, setExibirLoader] = useState(false);

  const { dreCodigo } = form.values;

  const nomeCampo = 'dreCodigo';

  const obterDres = useCallback(async () => {
    setExibirLoader(true);
    const resposta = await AbrangenciaServico.buscarDres()
      .catch(e => erros(e))
      .finally(() => setExibirLoader(false));

    if (resposta?.data?.length) {
      const lista = resposta.data.sort(FiltroHelper.ordenarLista('nome'));

      if (lista?.length === 1) {
        const { codigo } = lista[0];

        if (!paramsRota?.id) {
          form.setFieldValue('dreCodigo', codigo);
          form.initialValues.dreCodigo = codigo;
        }
      }

      if (usuario.possuiPerfilSme && lista?.length > 1) {
        lista.unshift({ codigo: OPCAO_TODOS, nome: 'Todas' });
        if (!paramsRota?.id) {
          form.setFieldValue('dreCodigo', OPCAO_TODOS);
          form.initialValues.dreCodigo = OPCAO_TODOS;
        }
      } else if (
        paramsRota?.id &&
        form.initialValues.dreCodigo === OPCAO_TODOS
      ) {
        lista.unshift({ codigo: OPCAO_TODOS, nome: 'Todas' });
      }
      setListaDres(lista);
    } else {
      form.setFieldValue('dreCodigo', undefined);
      setListaDres([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paramsRota, usuario.possuiPerfilSme]);

  useEffect(() => {
    if (!paramsRota?.id || (paramsRota?.id && dreCodigo)) {
      obterDres();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [obterDres, paramsRota]);

  return (
    <Loader loading={exibirLoader} ignorarTip>
      <SelectComponent
        id="codigo-dre"
        label="Diretoria Regional de Educação (DRE)"
        lista={listaDres}
        valueOption="codigo"
        valueText="nome"
        disabled={listaDres?.length === 1 || desabilitarCampos}
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

DreReabertura.propTypes = {
  form: PropTypes.oneOfType([PropTypes.object]),
  onChangeCampos: PropTypes.func,
};

DreReabertura.defaultProps = {
  form: null,
  onChangeCampos: () => null,
};

export default DreReabertura;
