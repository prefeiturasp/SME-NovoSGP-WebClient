import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ROUTES } from '@/core/enum/routes';
import { ModalidadeEnum } from '@/core/enum/modalidade-enum';
import {
  setDesabilitarCamposPlanoAula,
  setExibirSwitchEscolhaObjetivos,
} from '~/redux/modulos/frequenciaPlanoAula/actions';
import AuditoriaPlanoAula from './auditoriaPlanoAula';
import CabecalhoDadosPlanoAula from './CabecalhoDadosPlanoAula/cabecalhoDadosPlanoAula';
import LicaoDeCasa from './CamposEditorPlanoAula/licaoDeCasa';
import ObjetivosEspecificosParaAula from './CamposEditorPlanoAula/objetivosEspecificosParaAula';
import RecuperacaoContinua from './CamposEditorPlanoAula/recuperacaoContinua';
import CopiarConteudoPlanoAula from './ModalCopiarConteudo/copiarConteudoPlanoAula';
import ModalErrosPlanoAula from './ModalErros/modalErrosPlanoAula';
import MuralPlanoAula from './muralPlanoAula';
import ObjetivosAprendizagemDesenvolvimento from './ObjetivosAprendizagemDesenvolvimento/objetivosAprendizagemDesenvolvimento';

const DadosPlanoAula = props => {
  const dispatch = useDispatch();

  const { aulaId } = props;

  const usuario = useSelector(state => state.usuario);
  const permissoesTela = usuario.permissoes[ROUTES.FREQUENCIA_PLANO_AULA];

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

  const aulaIdPodeEditar = useSelector(
    state => state.frequenciaPlanoAula?.aulaIdPodeEditar
  );

  useEffect(() => {
    let desabilitar =
      dadosPlanoAula?.id > 0
        ? somenteConsulta || !permissoesTela.podeAlterar
        : somenteConsulta || !permissoesTela.podeIncluir;

    if (desabilitar) {
      dispatch(setDesabilitarCamposPlanoAula(desabilitar));
      return;
    }
    if (!aulaIdPodeEditar) {
      desabilitar = true;
    }

    dispatch(setDesabilitarCamposPlanoAula(desabilitar));
  }, [permissoesTela, somenteConsulta, dadosPlanoAula, dispatch]);

  useEffect(() => {
    const ehEja = !!(
      turmaSelecionada &&
      (Number(turmaSelecionada.modalidade) === ModalidadeEnum.EJA ||
        Number(turmaSelecionada.modalidade) === ModalidadeEnum.CELP)
    );

    const ehMedio = !!(
      turmaSelecionada &&
      Number(turmaSelecionada.modalidade) === ModalidadeEnum.Medio
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
          <CopiarConteudoPlanoAula />
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
