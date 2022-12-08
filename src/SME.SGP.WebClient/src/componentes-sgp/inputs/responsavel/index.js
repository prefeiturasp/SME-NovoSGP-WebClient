/* eslint-disable react/prop-types */
import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Loader, CampoTexto } from '~/componentes';
import { SGP_INPUT_RESPONSAVEL } from '~/constantes/ids/input';

export const Responsavel = ({
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

    // TODO: Função para buscar responsavel
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
        label="Responsável"
        onChange={onChange()}
        allowClear={allowClear}
        iconeBusca={iconeBusca}
        desabilitado={disabled}
        id={SGP_INPUT_RESPONSAVEL}
        placeholder="Procure pelo nome da criança/estudante"
      />
    </Loader>
  );
};

Responsavel.propTypes = {
  name: PropTypes.string,
  disabled: PropTypes.bool,
  onChange: PropTypes.func,
  allowClear: PropTypes.bool,
  iconeBusca: PropTypes.bool,
  form: PropTypes.oneOfType([PropTypes.any]),
};

Responsavel.defaultProps = {
  form: null,
  disabled: false,
  allowClear: false,
  iconeBusca: false,
  name: 'responsavel',
  onChange: () => null,
};
