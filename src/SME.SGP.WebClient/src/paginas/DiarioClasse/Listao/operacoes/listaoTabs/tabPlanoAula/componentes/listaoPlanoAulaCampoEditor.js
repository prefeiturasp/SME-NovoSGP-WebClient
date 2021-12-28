import PropTypes from 'prop-types';
import React from 'react';
import shortid from 'shortid';
import JoditEditor from '~/componentes/jodit-editor/joditEditor';

const ObjetivosEspecificosDesenvolvimentoAula = props => {
  const { dados, desabilitar, onChange } = props;

  const validarSeEhObrigatorio = () => {
    // TODO
    return false;
  };

  const desabilitarEditor = desabilitar || validarSeEhObrigatorio();

  return (
    <fieldset className="mt-3">
      <JoditEditor
        id={shortid.generate()}
        label="Objetivos específicos e desenvolvimento da aula"
        validarSeTemErro={valor => !valor && !desabilitar}
        mensagemErro="Campo obrigatório"
        desabilitar={desabilitarEditor}
        readonly={desabilitarEditor}
        onChange={onChange}
        value={dados?.descricao}
      />
    </fieldset>
  );
};

ObjetivosEspecificosDesenvolvimentoAula.propTypes = {
  dados: PropTypes.oneOf(PropTypes.object),
  desabilitar: PropTypes.bool,
  onChange: PropTypes.func,
};

ObjetivosEspecificosDesenvolvimentoAula.defaultProps = {
  dados: null,
  desabilitar: false,
  onChange: () => null,
};

export default ObjetivosEspecificosDesenvolvimentoAula;
