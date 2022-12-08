import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Loader, SelectComponent } from '~/componentes';
import { SGP_SELECT_UE } from '~/constantes/ids/select';
import { AbrangenciaServico, erros } from '~/servicos';

export const Ue = ({
  name,
  form,
  onChange,
  disabled,
  dreCodigo,
  showSearch,
  labelRequired,
}) => {
  const [listaUes, setListaUes] = useState([]);
  const [exibirLoader, setExibirLoader] = useState(false);

  const { anoLetivo } = form.values;
  const consideraHistorico = !!form.values?.consideraHistorico;

  const obterUes = useCallback(async () => {
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
        form.setFieldValue(name, String(lista[0]?.id));
      }

      setListaUes(lista);
    } else {
      form.initialValues[name] = undefined;
      setListaUes([]);
    }
  }, [form, name, consideraHistorico, anoLetivo, dreCodigo]);

  useEffect(() => {
    if (dreCodigo) {
      obterUes();
    } else {
      form.setFieldValue(name, undefined);
      setListaUes([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dreCodigo]);

  return (
    <Loader loading={exibirLoader} ignorarTip>
      <SelectComponent
        name={name}
        form={form}
        valueOption="id"
        valueText="nome"
        lista={listaUes}
        id={SGP_SELECT_UE}
        onChange={onChange()}
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
  dreCodigo: PropTypes.string,
  labelRequired: PropTypes.bool,
  form: PropTypes.oneOfType([PropTypes.any]),
};

Ue.defaultProps = {
  form: null,
  name: 'ueId',
  dreCodigo: '',
  disabled: false,
  showSearch: true,
  labelRequired: true,
  onChange: () => null,
};
