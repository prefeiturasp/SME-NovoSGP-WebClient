import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import {
  setDadosModalAnotacaoFrequencia,
  setExibirModalAnotacaoFrequencia,
} from '~/redux/modulos/modalAnotacaoFrequencia/actions';
import ModalAnotacoesFrequencia from '~/componentes-sgp/ModalAnotacoes/modalAnotacoes';

const ListaoModalAnotacaoFrequencia = ({
  dadosListaFrequencia,
  ehInfantil,
  componenteCurricularId,
  desabilitarCampos,
  fechouModal,
}) => {
  const exibirModalAnotacaoFrequencia = useSelector(
    state => state.modalAnotacaoFrequencia.exibirModalAnotacaoFrequencia
  );

  const dadosModalAnotacaoFrequencia = useSelector(
    state => state.modalAnotacaoFrequencia.dadosModalAnotacaoFrequencia
  );

  return (
    <ModalAnotacoesFrequencia
      dadosListaFrequencia={dadosListaFrequencia}
      ehInfantil={ehInfantil}
      aulaId={dadosModalAnotacaoFrequencia?.aulaId}
      componenteCurricularId={componenteCurricularId}
      desabilitarCampos={desabilitarCampos}
      exibirModal={exibirModalAnotacaoFrequencia}
      setExibirModal={setExibirModalAnotacaoFrequencia}
      dadosModal={dadosModalAnotacaoFrequencia}
      setDadosModal={setDadosModalAnotacaoFrequencia}
      fechouModal={(salvou, excluiu) => {
        if (salvou) {
          dadosModalAnotacaoFrequencia.aula.possuiAnotacao = true;
        } else if (excluiu) {
          dadosModalAnotacaoFrequencia.aula.possuiAnotacao = false;
        }
        fechouModal();
      }}
    />
  );
};

ListaoModalAnotacaoFrequencia.propTypes = {
  dadosListaFrequencia: PropTypes.oneOfType([PropTypes.array]),
  ehInfantil: PropTypes.bool,
  componenteCurricularId: PropTypes.oneOfType([PropTypes.any]),
  desabilitarCampos: PropTypes.bool,
  fechouModal: PropTypes.func,
};

ListaoModalAnotacaoFrequencia.defaultProps = {
  dadosListaFrequencia: [],
  ehInfantil: false,
  componenteCurricularId: '',
  desabilitarCampos: false,
  fechouModal: () => {},
};

export default ListaoModalAnotacaoFrequencia;
