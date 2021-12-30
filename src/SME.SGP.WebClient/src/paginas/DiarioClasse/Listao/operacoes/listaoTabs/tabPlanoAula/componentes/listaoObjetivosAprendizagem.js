import { Row } from 'antd';
import PropTypes from 'prop-types';
import React, { useContext, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Base } from '~/componentes';
import ListaoContext from '~/paginas/DiarioClasse/Listao/listaoContext';
import { setTelaEmEdicao } from '~/redux/modulos/geral/actions';
import ObjetivosEspecificosDesenvolvimentoAula from './listaoPlanoAulaCampoEditor';
import AdicionarObjetivosAprendizagem from './modalObjetivosAprendizagem/adicionarObjetivosAprendizagem';

const ListaoObjetivosAprendizagem = props => {
  const dispatch = useDispatch();

  const { indexPlano, desabilitarCampos, plano } = props;

  const {
    listaObjetivosAprendizagem,
    setDadosPlanoAula,
    dadosPlanoAula,
    componenteCurricular,
  } = useContext(ListaoContext);

  const [exibirModal, setExibirModal] = useState(false);

  const idsObjetivosAprendizagemSelecionados =
    dadosPlanoAula?.[indexPlano]?.idsObjetivosAprendizagemSelecionados;

  const [idsObjetivos, setIdsObjetivos] = useState(
    idsObjetivosAprendizagemSelecionados
  );

  const onClickAdicionar = () => setExibirModal(true);

  const onChange = ids => {
    if (!desabilitarCampos) {
      const novaListaIds = [...ids];
      dadosPlanoAula[
        indexPlano
      ].idsObjetivosAprendizagemSelecionados = novaListaIds;
      setIdsObjetivos(novaListaIds);

      dadosPlanoAula[indexPlano].alterado = true;
      setDadosPlanoAula(dadosPlanoAula);
      dispatch(setTelaEmEdicao(true));
    }
  };

  const semObjetivoSelecionado = !idsObjetivos?.length;
  const necessarioSelecionarObjetivo = () =>
    componenteCurricular?.possuiObjetivos && semObjetivoSelecionado;

  return (
    <>
      <Row gutter={[24, 24]}>
        <AdicionarObjetivosAprendizagem
          listaObjetivosAprendizagem={listaObjetivosAprendizagem}
          idsObjetivosAprendizagemSelecionados={idsObjetivos}
          onChange={onChange}
          exibirModal={exibirModal}
          setExibirModal={setExibirModal}
          onClickAdicionar={onClickAdicionar}
          desabilitar={desabilitarCampos}
        />
      </Row>
      {necessarioSelecionarObjetivo() ? (
        <p style={{ color: `${Base.VermelhoAlerta}` }}>
          Você precisa selecionar pelo menos um objetivo para poder inserir a
          descrição do plano.
        </p>
      ) : (
        ''
      )}
      <ObjetivosEspecificosDesenvolvimentoAula
        dados={plano}
        indexPlano={indexPlano}
        desabilitar={desabilitarCampos || necessarioSelecionarObjetivo()}
      />
    </>
  );
};

ListaoObjetivosAprendizagem.propTypes = {
  indexPlano: PropTypes.number,
  desabilitarCampos: PropTypes.bool,
  plano: PropTypes.oneOfType([PropTypes.any]),
};

ListaoObjetivosAprendizagem.defaultProps = {
  indexPlano: null,
  desabilitarCampos: false,
  plano: null,
};

export default ListaoObjetivosAprendizagem;
