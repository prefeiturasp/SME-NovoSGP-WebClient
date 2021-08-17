import PropTypes from 'prop-types';
import React from 'react';
import { JoditEditor } from '~/componentes';

const DescricaoComunicados = ({ form, onChangeCampos, desabilitar }) => {
  return (
    <JoditEditor
      label="Descrição"
      name="descricao"
      onChange={() => onChangeCampos()}
      permiteInserirArquivo={false}
      form={form}
      desabilitar={desabilitar}
      value={form?.values?.descricao}
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
