import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Loader, SelectComponent } from '~/componentes';
import { SGP_SELECT_FLUXO_ALERTA_NAAPA } from '~/constantes/ids/select';
import { erros } from '~/servicos';
import ServicoNAAPA from '~/servicos/Paginas/Gestao/NAAPA/ServicoNAAPA';

export const FluxoAlertaNAAPA = ({
  name,
  form,
  onChange,
  disabled,
  multiple,
  showSearch,
  updateData,
  labelRequired,
}) => {
  const [exibirLoader, setExibirLoader] = useState(false);
  const [dados, setDados] = useState([]);

  const obterDados = useCallback(async () => {
    setExibirLoader(true);

    const resposta = await ServicoNAAPA.obterFluxosAlerta()
      .catch(e => erros(e))
      .finally(() => setExibirLoader(false));

    if (resposta?.data?.length) {
      setDados(resposta.data);
    } else {
      setDados([]);
      form.setFieldValue(name, undefined);
    }
  }, []);

  useEffect(() => {
    obterDados();
  }, []);

  return (
    <Loader loading={exibirLoader} ignorarTip>
      <SelectComponent
        name={name}
        form={form}
        multiple={multiple}
        valueOption="id"
        valueText="nome"
        lista={dados}
        showSearch={showSearch}
        label="Fluxo de alerta"
        labelRequired={labelRequired}
        id={SGP_SELECT_FLUXO_ALERTA_NAAPA}
        placeholder="Fluxo de alerta"
        disabled={dados?.length === 1 || disabled}
        setValueOnlyOnChange
        onChange={newValue => {
          form.setFieldValue('modoEdicao', true);

          form.setFieldValue(name, newValue);
          form.setFieldTouched(name, true, true);
          onChange(newValue);
        }}
      />
    </Loader>
  );
};

FluxoAlertaNAAPA.propTypes = {
  name: PropTypes.string,
  disabled: PropTypes.bool,
  multiple: PropTypes.bool,
  onChange: PropTypes.func,
  showSearch: PropTypes.bool,
  labelRequired: PropTypes.bool,
  form: PropTypes.oneOfType([PropTypes.any]),
};

FluxoAlertaNAAPA.defaultProps = {
  form: null,
  disabled: false,
  multiple: true,
  showSearch: true,
  labelRequired: false,
  onChange: () => null,
  name: 'fluxoAlertaIds',
};
