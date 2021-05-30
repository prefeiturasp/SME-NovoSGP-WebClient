import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Tooltip } from 'antd';
import PropTypes from 'prop-types';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Base } from '~/componentes/colors';
import {
  setDadosModalAnotacaoFrequencia,
  setExibirModalAnotacaoFrequencia,
} from '~/redux/modulos/frequenciaPlanoAula/actions';
import { ContainerBtbAnotacao } from '../listaFrequencia.css';

const BotaoAnotacao = props => {
  const { indexAluno, desabilitarCampos, ehInfantil } = props;

  const dispatch = useDispatch();

  const possuiAnotacao = useSelector(
    state =>
      state.frequenciaPlanoAula?.listaDadosFrequencia?.listaFrequencia?.[
        indexAluno
      ]?.possuiAnotacao
  );

  const aluno = useSelector(
    state =>
      state.frequenciaPlanoAula?.listaDadosFrequencia?.listaFrequencia?.[
        indexAluno
      ]
  );

  const podeAbrirModal =
    (aluno.permiteAnotacao && !desabilitarCampos) ||
    (aluno.possuiAnotacao && desabilitarCampos);

  const onClickAnotacao = () => {
    dispatch(setDadosModalAnotacaoFrequencia(aluno));
    dispatch(setExibirModalAnotacaoFrequencia(true));
  };

  const cor = possuiAnotacao ? Base.Verde : Base.Azul;

  return (
    <Tooltip
      title={
        possuiAnotacao
          ? `${ehInfantil ? 'Criança' : 'Estudante'} com anotações`
          : ''
      }
      placement="top"
    >
      <div className="d-flex justify-content-end mr-2">
        <ContainerBtbAnotacao
          style={{ marginTop: '-5px' }}
          podeAbrirModal={podeAbrirModal}
          cor={cor}
          onClick={() => {
            if (podeAbrirModal) {
              onClickAnotacao();
            }
          }}
        >
          <FontAwesomeIcon
            style={{
              fontSize: '16px',
              cursor: podeAbrirModal ? 'pointer' : 'not-allowed',
              color: cor,
              margin: '6.5px',
            }}
            icon={faEdit}
          />
        </ContainerBtbAnotacao>
      </div>
    </Tooltip>
  );
};

BotaoAnotacao.propTypes = {
  indexAluno: PropTypes.number,
  desabilitarCampos: PropTypes.bool,
  ehInfantil: PropTypes.bool,
};

BotaoAnotacao.defaultProps = {
  indexAluno: null,
  desabilitarCampos: false,
  ehInfantil: false,
};

export default BotaoAnotacao;
