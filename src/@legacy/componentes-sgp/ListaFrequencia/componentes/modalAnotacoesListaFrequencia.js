import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import {
  setDadosModalAnotacaoFrequencia,
  setExibirModalAnotacaoFrequencia,
} from '~/redux/modulos/frequenciaPlanoAula/actions';
import ModalAnotacoesFrequencia from '~/componentes-sgp/ModalAnotacoes/modalAnotacoes';

const ModalAnotacoesListaFrequencia = ({
  dadosListaFrequencia,
  ehInfantil,
  aulaId,
  desabilitarCampos,
  dataSelecionadaMotivosAusencias,
}) => {
  const exibirModalAnotacaoFrequencia = useSelector(
    state => state.frequenciaPlanoAula.exibirModalAnotacaoFrequencia
  );

  const dadosModalAnotacaoFrequencia = useSelector(
    state => state.frequenciaPlanoAula.dadosModalAnotacaoFrequencia
  );

  const componenteCurricular = useSelector(
    state => state.frequenciaPlanoAula.componenteCurricular
  );

  return exibirModalAnotacaoFrequencia ? (
    <ModalAnotacoesFrequencia
      dadosListaFrequencia={dadosListaFrequencia}
      ehInfantil={ehInfantil}
      aulaId={aulaId}
      componenteCurricularId={componenteCurricular?.codigoComponenteCurricular}
      desabilitarCampos={desabilitarCampos}
      exibirModal={exibirModalAnotacaoFrequencia}
      setExibirModal={setExibirModalAnotacaoFrequencia}
      dadosModal={dadosModalAnotacaoFrequencia}
      setDadosModal={setDadosModalAnotacaoFrequencia}
      exibirMotivosAusencia={!!componenteCurricular?.registraFrequencia}
      dataSelecionadaMotivosAusencias={dataSelecionadaMotivosAusencias}
    />
  ) : (
    <></>
  );
};

ModalAnotacoesListaFrequencia.propTypes = {
  dadosListaFrequencia: PropTypes.oneOfType([PropTypes.array]),
  ehInfantil: PropTypes.bool,
  aulaId: PropTypes.oneOfType([PropTypes.any]),
  componenteCurricularId: PropTypes.oneOfType([PropTypes.any]),
  desabilitarCampos: PropTypes.bool,
};

ModalAnotacoesListaFrequencia.defaultProps = {
  dadosListaFrequencia: [],
  ehInfantil: false,
  aulaId: '',
  componenteCurricularId: '',
  desabilitarCampos: false,
};

export default ModalAnotacoesListaFrequencia;
