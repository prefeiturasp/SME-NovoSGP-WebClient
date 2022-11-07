import PropTypes from 'prop-types';
import React from 'react';
import { CampoTexto } from '~/componentes';

const TituloOcorrencia = ({ form, onChangeCampos, desabilitar }) => {
  return (
    <CampoTexto
      form={form}
      name="titulo"
      id="tituloOcorrencia"
      label="Título da ocorrência"
      placeholder="Situação"
      maxLength={50}
      //   desabilitado={desabilitarCampos()}
      //   onChange={() => setModoEdicao(true)}
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
