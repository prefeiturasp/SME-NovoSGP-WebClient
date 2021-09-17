import PropTypes from 'prop-types';
import React from 'react';
import { CampoTexto } from '~/componentes';

const TituloComunicados = ({ form, onChangeCampos, desabilitar }) => {
  return (
    <CampoTexto
      label="Título"
      name="titulo"
      placeholder="Pesquise pelo título do comunicado"
      onChange={() => onChangeCampos()}
      form={form}
      desabilitado={desabilitar}
    />
  );
};

TituloComunicados.propTypes = {
  form: PropTypes.oneOfType([PropTypes.object]),
  onChangeCampos: PropTypes.func,
  desabilitar: PropTypes.bool,
};

TituloComunicados.defaultProps = {
  form: null,
  onChangeCampos: () => null,
  desabilitar: false,
};

export default TituloComunicados;
