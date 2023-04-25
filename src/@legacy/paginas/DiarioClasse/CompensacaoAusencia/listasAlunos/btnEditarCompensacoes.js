import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { Base } from '~/componentes';
import _ from 'lodash';
import ModalAusenciasAluno from './modalAusenciasAluno';

const BtnEditarCompensacoes = props => {
  const {
    listaAusenciaCompensada,
    atualizarValoresListaCompensacao,
    desabilitarCampos,
    dadosAluno,
    idCompensacaoAusencia,
    turmaCodigo,
    bimestre,
    disciplinaId,
    indexAluno,
  } = props;

  const [exibirModal, setExibirModal] = useState(false);

  const podeAbrirModal = !!dadosAluno?.quantidadeFaltasCompensadas;

  const atualizarValoresAulasCompensadasPorAluno = (
    dados,
    dadosIniciaisListasAusenciasCompensadas
  ) => {
    if (indexAluno >= 0) {
      const lista = _.cloneDeep(listaAusenciaCompensada);
      lista[indexAluno].compensacoes = dados?.length ? dados : [];
      lista[indexAluno].dadosIniciaisListasAusenciasCompensadas =
        dadosIniciaisListasAusenciasCompensadas;

      atualizarValoresListaCompensacao(lista);
    }
  };

  const onConfirmarEditarCompensacao = (
    dados,
    dadosIniciaisListasAusenciasCompensadas
  ) => {
    atualizarValoresAulasCompensadasPorAluno(
      dados,
      dadosIniciaisListasAusenciasCompensadas
    );
    setExibirModal(false);
  };

  const onClose = () => setExibirModal(false);

  return (
    <>
      <ModalAusenciasAluno
        exibirModal={exibirModal}
        dadosAluno={dadosAluno}
        desabilitar={desabilitarCampos}
        onClose={onClose}
        onConfirmarEditarCompensacao={onConfirmarEditarCompensacao}
        atualizarValoresAulasCompensadasPorAluno={
          atualizarValoresAulasCompensadasPorAluno
        }
        idCompensacaoAusencia={idCompensacaoAusencia}
        turmaCodigo={turmaCodigo}
        bimestre={bimestre}
        disciplinaId={disciplinaId}
      />

      <div
        onClick={() => {
          if (podeAbrirModal) {
            setExibirModal(true);
          }
        }}
      >
        <FontAwesomeIcon
          className="manual-style-font-awesome-icon"
          style={{
            fontSize: '18px',
            cursor: !podeAbrirModal ? 'not-allowed' : 'pointer',
            color: !podeAbrirModal ? Base.CinzaDesabilitado : Base.CinzaMako,
          }}
          icon={faEdit}
        />
      </div>
    </>
  );
};

BtnEditarCompensacoes.propTypes = {
  listaAusenciaCompensada: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.object,
  ]),
  atualizarValoresListaCompensacao: PropTypes.func,
  desabilitarCampos: PropTypes.bool,
  dadosAluno: PropTypes.oneOfType([PropTypes.any]),
};

BtnEditarCompensacoes.defaultProps = {
  listaAusenciaCompensada: [],
  atualizarValoresListaCompensacao: () => {},
  desabilitarCampos: false,
  dadosAluno: null,
};

export default BtnEditarCompensacoes;
