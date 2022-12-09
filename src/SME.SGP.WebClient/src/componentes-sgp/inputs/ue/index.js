import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Loader, SelectComponent } from '~/componentes';
import { OPCAO_TODOS } from '~/constantes';
import { SGP_SELECT_UE } from '~/constantes/ids/select';
import { AbrangenciaServico, erros } from '~/servicos';

export const Ue = ({
  name,
  form,
  onChange,
  disabled,
  showSearch,
  labelRequired,
  mostrarOpcaoTodas,
}) => {
  const [listaUes, setListaUes] = useState([]);
  const [exibirLoader, setExibirLoader] = useState(false);

  const { anoLetivo, dreCodigo } = form.values;
  const consideraHistorico = !!form.values?.consideraHistorico;

  const limparDados = () => {
    setListaUes([]);
    form.setFieldValue(name, undefined);
    // form.setFieldTouched(name, false, false);
  };

  const obterUes = useCallback(async () => {
    const OPCAO_TODAS_UE = { codigo: OPCAO_TODOS, nome: 'Todas' };

    if (dreCodigo === OPCAO_TODOS) {
      setListaUes([OPCAO_TODAS_UE]);
      form.setFieldValue(name, OPCAO_TODOS);
      return;
    }

    setExibirLoader(true);

    const resposta = await AbrangenciaServico.buscarUes(
      dreCodigo,
      `v1/abrangencias/${consideraHistorico}/dres/${dreCodigo}/ues?anoLetivo=${anoLetivo}`,
      true
    )
      .catch(e => erros(e))
      .finally(() => setExibirLoader(false));

    if (resposta?.data?.length) {
      const lista = resposta.data;

      if (lista?.length === 1) {
        form.setFieldValue(name, String(lista[0]?.codigo));
      } else if (mostrarOpcaoTodas) {
        lista.unshift(OPCAO_TODAS_UE);
      }

      setListaUes(lista);
    } else {
      limparDados();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [consideraHistorico, anoLetivo, dreCodigo]);

  useEffect(() => {
    limparDados();
    if (dreCodigo) obterUes();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dreCodigo]);

  return (
    <Loader loading={exibirLoader} ignorarTip>
      <SelectComponent
        name={name}
        form={form}
        valueOption="codigo"
        valueText="nome"
        lista={listaUes}
        id={SGP_SELECT_UE}
        onChange={onChange}
        showSearch={showSearch}
        labelRequired={labelRequired}
        label="Unidade Escolar (UE)"
        placeholder="Unidade Escolar (UE)"
        disabled={!dreCodigo || listaUes?.length === 1 || disabled}
      />
    </Loader>
  );
};

Ue.propTypes = {
  name: PropTypes.string,
  disabled: PropTypes.bool,
  onChange: PropTypes.func,
  showSearch: PropTypes.bool,
  labelRequired: PropTypes.bool,
  mostrarOpcaoTodas: PropTypes.bool,
  form: PropTypes.oneOfType([PropTypes.any]),
};

Ue.defaultProps = {
  form: null,
  name: 'ueCodigo',
  disabled: false,
  showSearch: true,
  labelRequired: true,
  onChange: () => null,
  mostrarOpcaoTodas: true,
};
