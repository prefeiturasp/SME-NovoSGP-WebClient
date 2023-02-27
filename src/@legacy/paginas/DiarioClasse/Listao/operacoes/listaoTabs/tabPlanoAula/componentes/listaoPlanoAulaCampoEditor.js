import PropTypes from 'prop-types';
import React, { useContext } from 'react';
import { useDispatch } from 'react-redux';
import shortid from 'shortid';
import JoditEditor from '~/componentes/jodit-editor/joditEditor';
import ListaoContext from '~/paginas/DiarioClasse/Listao/listaoContext';
import { setTelaEmEdicao } from '~/redux/modulos/geral/actions';

const ObjetivosEspecificosDesenvolvimentoAula = props => {
  const dispatch = useDispatch();

  const { dados, desabilitar, indexPlano } = props;

  const { dadosPlanoAula, setDadosPlanoAula } = useContext(ListaoContext);

  const onChangeEditor = novaDescricao => {
    dadosPlanoAula[indexPlano].descricao = novaDescricao;
    dadosPlanoAula[indexPlano].alterado = true;
    setDadosPlanoAula(dadosPlanoAula);
    dispatch(setTelaEmEdicao(true));
  };

  return (
    <fieldset className="mt-3">
      <JoditEditor
        id={shortid.generate()}
        label="Objetivos específicos e desenvolvimento da aula"
        validarSeTemErro={valor => !valor && !desabilitar}
        mensagemErro="Campo obrigatório"
        desabilitar={desabilitar}
        readonly={desabilitar}
        onChange={onChangeEditor}
        value={dados?.descricao}
      />
    </fieldset>
  );
};

ObjetivosEspecificosDesenvolvimentoAula.propTypes = {
  dados: PropTypes.oneOf([PropTypes.object]),
  desabilitar: PropTypes.bool,
  indexPlano: PropTypes.number,
};

ObjetivosEspecificosDesenvolvimentoAula.defaultProps = {
  dados: null,
  desabilitar: false,
  indexPlano: null,
};

export default ObjetivosEspecificosDesenvolvimentoAula;
