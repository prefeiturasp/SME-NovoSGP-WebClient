import PropTypes from 'prop-types';
import React from 'react';
import { JoditEditor } from '~/componentes';

const DescricaoOcorrencia = ({ form, onChangeCampos, desabilitar }) => {
  return (
    <JoditEditor
      label="Descrição"
      form={form}
      value={form?.values?.descricao}
      name="descricao"
      id="SGP_JODIT_EDITOR_DESCRICAO"
      permiteInserirArquivo
      desabilitar={desabilitar}
      onChange={() => onChangeCampos()}
      labelRequired
    />
  );
};

DescricaoOcorrencia.propTypes = {
  form: PropTypes.oneOfType([PropTypes.object]),
  onChangeCampos: PropTypes.func,
  desabilitar: PropTypes.bool,
};

DescricaoOcorrencia.defaultProps = {
  form: null,
  onChangeCampos: () => null,
  desabilitar: false,
};

export default DescricaoOcorrencia;
