import { faEdit, faEye } from '@fortawesome/free-solid-svg-icons';
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
  const { indexAluno, ehInfantil } = props;

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

  const onClickAnotacao = () => {
    dispatch(setDadosModalAnotacaoFrequencia(aluno));
    dispatch(setExibirModalAnotacaoFrequencia(true));
  };

  const cor = possuiAnotacao ? Base.Azul : Base.CinzaMako;

  return (
    <Tooltip
      title={
        possuiAnotacao
          ? `${ehInfantil ? 'Criança' : 'Estudante'} com anotações`
          : ''
      }
      placement="top"
    >
      <div className="d-flex justify-content-end mr-2 p-2">
        <ContainerBtbAnotacao
          style={{ marginTop: '-5px' }}
          possuiAnotacao={possuiAnotacao}
          cor={cor}
          onClick={() => {
            onClickAnotacao();
          }}
        >
          {possuiAnotacao ? (
            <FontAwesomeIcon
              style={{
                fontSize: '16px',
                cursor: 'pointer',
                color: cor,
                margin: '6.5px',
              }}
              icon={faEye}
            />
          ) : (
            <FontAwesomeIcon
              style={{
                fontSize: '16px',
                cursor: 'pointer',
                color: cor,
                margin: '6.5px',
              }}
              icon={faEdit}
            />
          )}
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
