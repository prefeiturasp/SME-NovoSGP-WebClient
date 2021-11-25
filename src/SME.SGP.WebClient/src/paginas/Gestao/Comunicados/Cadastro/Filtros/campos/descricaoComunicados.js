import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { JoditEditor } from '~/componentes';

const DescricaoComunicados = ({ form, onChangeCampos, desabilitar }) => {
  const [valoresIniciais] = useState({ descricao: form?.values?.descricao });

  return (
    <JoditEditor
      label="Descrição"
      name="descricao"
      onChange={() => onChangeCampos()}
      permiteInserirArquivo={false}
      form={form}
      desabilitar={desabilitar}
      value={valoresIniciais.descricao}
    />
  );
};

DescricaoComunicados.propTypes = {
  form: PropTypes.oneOfType([PropTypes.object]),
  onChangeCampos: PropTypes.func,
  desabilitar: PropTypes.bool,
};

DescricaoComunicados.defaultProps = {
  form: null,
  onChangeCampos: () => null,
  desabilitar: false,
};

export default DescricaoComunicados;
