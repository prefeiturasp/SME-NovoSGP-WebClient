import React, { useMemo } from 'react';
import PropTypes from 'prop-types';

import { JoditEditor } from '~/componentes';

const EditorRegistrosAnteriores = ({
  id,
  registroAlterado,
  onChange,
  editando,
  validarSeTemErro,
  data,
}) => {
  return useMemo(
    () => (
      <JoditEditor
        validarSeTemErro={validarSeTemErro}
        mensagemErro="Campo obrigatório"
        label={`Registro - ${window.moment(data).format('DD/MM/YYYY')}`}
        id={`${id}-editor`}
        value={registroAlterado}
        onChange={onChange}
        desabilitar={!editando}
      />
    ),
    [id, registroAlterado, onChange, editando, validarSeTemErro, data]
  );
};

EditorRegistrosAnteriores.propTypes = {
  id: PropTypes.number,
  registroAlterado: PropTypes.string,
  onChange: PropTypes.func,
  editando: PropTypes.bool,
  validarSeTemErro: PropTypes.func,
  data: PropTypes.string,
};

EditorRegistrosAnteriores.defaultProps = {
  id: 0,
  registroAlterado: '',
  onChange: () => {},
  editando: false,
  validarSeTemErro: () => {},
  data: '',
};

export default EditorRegistrosAnteriores;
