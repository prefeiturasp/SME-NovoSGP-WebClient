import { faEdit, faEye } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Tooltip } from 'antd';
import PropTypes from 'prop-types';
import React from 'react';
import { Base } from '~/componentes/colors';
import { ContainerBtbAnotacao } from '~/paginas/DiarioClasse/Listao/operacoes/listaoTabs/tabFrequencia/lista/listaFrequencia.css';

const ListaoBotaoAnotacao = props => {
  const {
    desabilitarCampos,
    ehInfantil,
    permiteAnotacao,
    possuiAnotacao,
    onClickAnotacao,
    descricaoTooltip,
  } = props;

  const podeAbrirModal =
    (permiteAnotacao && !desabilitarCampos) ||
    (possuiAnotacao && desabilitarCampos);

  const cor = possuiAnotacao ? Base.Azul : Base.CinzaMako;

  const propsStyleIcon = {
    fontSize: '16px',
    cursor: podeAbrirModal ? 'pointer' : 'not-allowed',
    color: cor,
    margin: '6.5px',
  };

  const descTooltip = possuiAnotacao
    ? `${ehInfantil ? 'Criança' : 'Estudante'} com anotações`
    : '';

  return (
    <Tooltip title={descricaoTooltip || descTooltip} placement="top">
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
  permiteAnotacao: PropTypes.bool,
  possuiAnotacao: PropTypes.bool,
  onClickAnotacao: PropTypes.func,
  descricaoTooltip: PropTypes.string,
};
ListaoBotaoAnotacao.defaultProps = {
  desabilitarCampos: false,
  ehInfantil: false,
  permiteAnotacao: true,
  possuiAnotacao: true,
  onClickAnotacao: () => null,
  descricaoTooltip: '',
};

export default ListaoBotaoAnotacao;
