import { Row } from 'antd';
import PropTypes from 'prop-types';
import React, { useContext, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Base } from '~/componentes';
import AdicionarObjetivosAprendizagem from '~/componentes-sgp/modalObjetivosAprendizagem/adicionarObjetivosAprendizagem';
import ListaoContext from '~/paginas/DiarioClasse/Listao/listaoContext';
import { setTelaEmEdicao } from '~/redux/modulos/geral/actions';
import ObjetivosEspecificosDesenvolvimentoAula from './listaoPlanoAulaCampoEditor';
import SwitchInformarObjetivosListao from './switchInformarObjetivosListao';

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

  const [
    checkedExibirEscolhaObjetivos,
    setCheckedExibirEscolhaObjetivos,
  ] = useState(false);

  const idsObjetivosAprendizagemSelecionados =
    dadosPlanoAula?.[indexPlano]?.idsObjetivosAprendizagemSelecionados;

  const ehAulaCj = dadosPlanoAula?.[indexPlano]?.aulaCj;

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
  const necessarioSelecionarObjetivo = () => {
    if (ehAulaCj && !checkedExibirEscolhaObjetivos) return false;

    return componenteCurricular?.possuiObjetivos && semObjetivoSelecionado;
  };

  return (
    <>
      <Row gutter={(24, 24)} type="flex" justify="end">
        <SwitchInformarObjetivosListao
          exibirSwitchEscolhaObjetivos={ehAulaCj}
          desabilitar={desabilitarCampos}
          checkedExibirEscolhaObjetivos={checkedExibirEscolhaObjetivos}
          setCheckedExibirEscolhaObjetivos={setCheckedExibirEscolhaObjetivos}
          indexPlano={indexPlano}
        />
      </Row>
      <Row gutter={[24, 24]}>
        <AdicionarObjetivosAprendizagem
          listaObjetivosAprendizagem={listaObjetivosAprendizagem}
          idsObjetivosAprendizagemSelecionados={idsObjetivos}
          onChange={onChange}
          exibirModal={exibirModal}
          setExibirModal={setExibirModal}
          onClickAdicionar={onClickAdicionar}
          desabilitar={desabilitarCampos}
          ehAulaCj={ehAulaCj}
          checkedExibirEscolhaObjetivos={checkedExibirEscolhaObjetivos}
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
