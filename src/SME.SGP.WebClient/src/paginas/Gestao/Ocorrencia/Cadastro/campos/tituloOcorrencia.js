import PropTypes from 'prop-types';
import React from 'react';
import { CampoTexto } from '~/componentes';

const TituloOcorrencia = ({ form, onChangeCampos, desabilitar }) => {
  return (
    <CampoTexto
      id="SGP_INPUT_TEXT_TITULO_OCORRENCIA"
      form={form}
      name="titulo"
      label="Título da ocorrência"
      placeholder="Situação"
      maxLength={50}
      desabilitado={desabilitar}
      onChange={() => onChangeCampos()}
      labelRequired
    />
  );
};

TituloOcorrencia.propTypes = {
  form: PropTypes.oneOfType([PropTypes.object]),
  onChangeCampos: PropTypes.func,
  desabilitar: PropTypes.bool,
};

TituloOcorrencia.defaultProps = {
  form: null,
  onChangeCampos: () => null,
  desabilitar: false,
};

export default TituloOcorrencia;
