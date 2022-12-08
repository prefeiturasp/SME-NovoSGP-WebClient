/* eslint-disable react/prop-types */
import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Loader, CampoTexto } from '~/componentes';
import { SGP_INPUT_PAAI_RESPONSAVEL } from '~/constantes/ids/input';

export const PAAIResponsavel = ({
  name,
  form,
  onChange,
  disabled,
  allowClear,
  iconeBusca,
}) => {
  const [exibirLoader, setExibirLoader] = useState(false);
  const obterResponsavel = useCallback(async () => {
    setExibirLoader(true);

    // TODO: Função para buscar paai responsavel
  }, []);

  useEffect(() => {
    if (true) {
      obterResponsavel();
    } else {
      form.setFieldValue(name, undefined);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Loader loading={exibirLoader} ignorarTip>
      <CampoTexto
        form={form}
        name={name}
        label="PAAI Responsável"
        onChange={onChange()}
        allowClear={allowClear}
        iconeBusca={iconeBusca}
        desabilitado={disabled}
        id={SGP_INPUT_PAAI_RESPONSAVEL}
        placeholder="Procure pelo nome da criança/estudante"
      />
    </Loader>
  );
};

PAAIResponsavel.propTypes = {
  name: PropTypes.string,
  disabled: PropTypes.bool,
  onChange: PropTypes.func,
  allowClear: PropTypes.bool,
  iconeBusca: PropTypes.bool,
  form: PropTypes.oneOfType([PropTypes.any]),
};

PAAIResponsavel.defaultProps = {
  form: null,
  disabled: false,
  allowClear: false,
  iconeBusca: false,
  name: 'paaiResponsavel',
  onChange: () => null,
};
