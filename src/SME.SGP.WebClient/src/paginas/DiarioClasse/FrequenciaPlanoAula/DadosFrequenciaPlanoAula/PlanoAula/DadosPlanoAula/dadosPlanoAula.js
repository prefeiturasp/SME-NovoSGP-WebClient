import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RotasDto } from '~/dtos';
import modalidade from '~/dtos/modalidade';
import {
  setDesabilitarCamposPlanoAula,
  setExibirSwitchEscolhaObjetivos,
} from '~/redux/modulos/frequenciaPlanoAula/actions';
import AuditoriaPlanoAula from './auditoriaPlanoAula';
import CabecalhoDadosPlanoAula from './CabecalhoDadosPlanoAula/cabecalhoDadosPlanoAula';
import DesenvolvimentoDaAula from './CamposEditorPlanoAula/desenvolvimentoDaAula';
import LicaoDeCasa from './CamposEditorPlanoAula/licaoDeCasa';
import ObjetivosEspecificosParaAula from './CamposEditorPlanoAula/objetivosEspecificosParaAula';
import RecuperacaoContinua from './CamposEditorPlanoAula/recuperacaoContinua';
import ModalCopiarConteudoPlanoAula from './ModalCopiarConteudo/modalCopiarConteudoPlanoAula';
import ModalErrosPlanoAula from './ModalErros/modalErrosPlanoAula';
import MuralPlanoAula from './muralPlanoAula';
import ObjetivosAprendizagemDesenvolvimento from './ObjetivosAprendizagemDesenvolvimento/objetivosAprendizagemDesenvolvimento';

const DadosPlanoAula = props => {
  const dispatch = useDispatch();

  const { aulaId } = props;

  const usuario = useSelector(state => state.usuario);
  const permissoesTela = usuario.permissoes[RotasDto.FREQUENCIA_PLANO_AULA];

  const dadosPlanoAula = useSelector(
    state => state.frequenciaPlanoAula.dadosPlanoAula
  );

  const somenteConsulta = useSelector(
    state => state.frequenciaPlanoAula.somenteConsulta
  );

  const { ehProfessorCj, turmaSelecionada } = usuario;

  const componenteCurricular = useSelector(
    store => store.frequenciaPlanoAula.componenteCurricular
  );

  useEffect(() => {
    if (dadosPlanoAula && dadosPlanoAula.id > 0) {
      const desabilitar = !permissoesTela.podeAlterar || somenteConsulta;
      dispatch(setDesabilitarCamposPlanoAula(desabilitar));
    } else {
      const desabilitar = !permissoesTela.podeIncluir || somenteConsulta;
      dispatch(setDesabilitarCamposPlanoAula(desabilitar));
    }
  }, [permissoesTela, somenteConsulta, dadosPlanoAula, dispatch]);

  useEffect(() => {
    const ehEja = !!(
      turmaSelecionada &&
      String(turmaSelecionada.modalidade) === String(modalidade.EJA)
    );

    const ehMedio = !!(
      turmaSelecionada &&
      String(turmaSelecionada.modalidade) === String(modalidade.ENSINO_MEDIO)
    );

    const esconderSwitch =
      !(componenteCurricular && componenteCurricular.possuiObjetivos) ||
      !ehProfessorCj ||
      ehEja ||
      ehMedio;

    dispatch(setExibirSwitchEscolhaObjetivos(!esconderSwitch));
  }, [turmaSelecionada, ehProfessorCj, componenteCurricular, dispatch]);

  return (
    <>
      {dadosPlanoAula ? (
        <>
          <ModalErrosPlanoAula />
          <ModalCopiarConteudoPlanoAula />
          <CabecalhoDadosPlanoAula />
          <ObjetivosAprendizagemDesenvolvimento />
          <ObjetivosEspecificosParaAula />
          <div className="mt-3 mb-3">
            <MuralPlanoAula aulaId={aulaId} />
          </div>
          <RecuperacaoContinua />
          <LicaoDeCasa />
          {dadosPlanoAula?.id > 0 ? <AuditoriaPlanoAula /> : ''}
        </>
      ) : (
        ''
      )}
    </>
  );
};

DadosPlanoAula.propTypes = {
  aulaId: PropTypes.number,
};

DadosPlanoAula.defaultProps = {
  aulaId: 0,
};

export default DadosPlanoAula;
