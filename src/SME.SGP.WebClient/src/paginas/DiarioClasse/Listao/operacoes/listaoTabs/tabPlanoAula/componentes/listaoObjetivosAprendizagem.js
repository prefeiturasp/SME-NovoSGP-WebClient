import PropTypes from 'prop-types';
import React, { useContext, useState } from 'react';
import { useDispatch } from 'react-redux';
import ListaoContext from '~/paginas/DiarioClasse/Listao/listaoContext';
import { setTelaEmEdicao } from '~/redux/modulos/geral/actions';
import AdicionarObjetivosAprendizagem from './modalObjetivosAprendizagem/adicionarObjetivosAprendizagem';

const ListaoObjetivosAprendizagem = props => {
  const dispatch = useDispatch();

  const { indexPlano, desabilitarCampos } = props;

  const {
    listaObjetivosAprendizagem,
    setDadosPlanoAula,
    dadosPlanoAula,
  } = useContext(ListaoContext);

  const [exibirModal, setExibirModal] = useState(false);

  const idsObjetivosAprendizagemSelecionados =
    dadosPlanoAula?.[indexPlano]?.idsObjetivosAprendizagemSelecionados;

  const onClickAdicionar = () => {
    setExibirModal(true);
  };

  const onChange = ids => {
    if (!desabilitarCampos) {
      dadosPlanoAula[indexPlano].idsObjetivosAprendizagemSelecionados = [
        ...ids,
      ];
      setDadosPlanoAula(dadosPlanoAula);
      dispatch(setTelaEmEdicao(true));
    }
  };

  return (
    <AdicionarObjetivosAprendizagem
      listaObjetivosAprendizagem={listaObjetivosAprendizagem}
      idsObjetivosAprendizagemSelecionados={
        idsObjetivosAprendizagemSelecionados
      }
      onChange={onChange}
      exibirModal={exibirModal}
      setExibirModal={setExibirModal}
      onClickAdicionar={onClickAdicionar}
      desabilitar={desabilitarCampos}
    />
  );
};

ListaoObjetivosAprendizagem.propTypes = {
  indexPlano: PropTypes.number,
  desabilitarCampos: PropTypes.bool,
};

ListaoObjetivosAprendizagem.defaultProps = {
  indexPlano: null,
  desabilitarCampos: false,
};

export default ListaoObjetivosAprendizagem;
