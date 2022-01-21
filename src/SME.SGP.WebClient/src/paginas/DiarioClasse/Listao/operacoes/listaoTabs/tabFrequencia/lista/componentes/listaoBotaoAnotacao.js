import { faEdit, faEye } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Tooltip } from 'antd';
import PropTypes from 'prop-types';
import React from 'react';
import { useDispatch } from 'react-redux';
import { Base } from '~/componentes/colors';
import { ContainerBtbAnotacao } from '~/paginas/DiarioClasse/Listao/operacoes/listaoTabs/tabFrequencia/lista/listaFrequencia.css';
import {
  setDadosModalAnotacaoFrequencia,
  setExibirModalAnotacaoFrequencia,
} from '~/redux/modulos/modalAnotacaoFrequencia/actions';

const ListaoBotaoAnotacao = props => {
  const {
    desabilitarCampos,
    ehInfantil,
    aluno,
    permiteAnotacao,
    possuiAnotacao,
  } = props;

  const dispatch = useDispatch();

  const podeAbrirModal =
    (permiteAnotacao && !desabilitarCampos) ||
    (possuiAnotacao && desabilitarCampos);

  const onClickAnotacao = () => {
    dispatch(setDadosModalAnotacaoFrequencia(aluno));
    dispatch(setExibirModalAnotacaoFrequencia(true));
  };

  const cor = possuiAnotacao ? Base.Azul : Base.CinzaMako;

  const propsStyleIcon = {
    fontSize: '16px',
    cursor: podeAbrirModal ? 'pointer' : 'not-allowed',
    color: cor,
    margin: '6.5px',
  };
  return (
    <Tooltip
      title={
        possuiAnotacao
          ? `${ehInfantil ? 'Criança' : 'Estudante'} com anotações`
          : ''
      }
      placement="top"
    >
      <span className={!podeAbrirModal ? 'desabilitar' : ''}>
        <ContainerBtbAnotacao
          podeAbrirModal={podeAbrirModal}
          possuiAnotacao={possuiAnotacao}
          cor={cor}
          onClick={() => {
            if (podeAbrirModal) {
              onClickAnotacao();
            }
          }}
        >
          {possuiAnotacao ? (
            <FontAwesomeIcon style={propsStyleIcon} icon={faEye} />
          ) : (
            <FontAwesomeIcon style={propsStyleIcon} icon={faEdit} />
          )}
        </ContainerBtbAnotacao>
      </span>
    </Tooltip>
  );
};

ListaoBotaoAnotacao.propTypes = {
  desabilitarCampos: PropTypes.bool,
  ehInfantil: PropTypes.bool,
  aluno: PropTypes.oneOfType(PropTypes.any),
  permiteAnotacao: PropTypes.bool,
  possuiAnotacao: PropTypes.bool,
};
ListaoBotaoAnotacao.defaultProps = {
  desabilitarCampos: false,
  ehInfantil: false,
  aluno: null,
  permiteAnotacao: true,
  possuiAnotacao: true,
};

export default ListaoBotaoAnotacao;
