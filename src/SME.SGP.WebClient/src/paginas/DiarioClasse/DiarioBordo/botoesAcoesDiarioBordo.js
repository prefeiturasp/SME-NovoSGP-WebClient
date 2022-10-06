import PropTypes from 'prop-types';
import React from 'react';
import { useSelector } from 'react-redux';
import BotaoVoltarPadrao from '~/componentes-sgp/BotoesAcaoPadrao/botaoVoltarPadrao';
import {
  SGP_BUTTON_CANCELAR,
  SGP_BUTTON_SALVAR_ALTERAR,
} from '~/componentes-sgp/filtro/idsCampos';
import Button from '~/componentes/button';
import { Colors } from '~/componentes/colors';

const BotoesAcoesDiarioBordo = props => {
  const {
    onClickVoltar,
    onClickCancelar,
    modoEdicao,
    desabilitarCampos,
    turmaInfantil,
    validaAntesDoSubmit,
    componenteCurricularSelecionado,
    dataSelecionada,
    id,
  } = props;

  const observacaoEmEdicao = useSelector(
    store => store.observacoesUsuario.observacaoEmEdicao
  );

  const novaObservacao = useSelector(
    store => store.observacoesUsuario.novaObservacao
  );

  return (
    <>
      <BotaoVoltarPadrao
        className="mr-2"
        onClick={() => onClickVoltar(observacaoEmEdicao, novaObservacao)}
      />
      <Button
        id={SGP_BUTTON_CANCELAR}
        label="Cancelar"
        color={Colors.Roxo}
        border
        bold
        className="mr-2"
        onClick={onClickCancelar}
        disabled={!modoEdicao || desabilitarCampos}
      />
      <Button
        id={SGP_BUTTON_SALVAR_ALTERAR}
        label={id ? 'Alterar' : 'Salvar'}
        color={Colors.Roxo}
        border
        bold
        onClick={validaAntesDoSubmit}
        disabled={
          !turmaInfantil ||
          desabilitarCampos ||
          !componenteCurricularSelecionado ||
          !dataSelecionada ||
          (id && !modoEdicao)
        }
      />
    </>
  );
};

BotoesAcoesDiarioBordo.propTypes = {
  onClickVoltar: PropTypes.func,
  onClickCancelar: PropTypes.func,
  validaAntesDoSubmit: PropTypes.func,
  modoEdicao: PropTypes.bool,
  desabilitarCampos: PropTypes.bool,
  turmaInfantil: PropTypes.bool,
  componenteCurricularSelecionado: PropTypes.oneOfType([PropTypes.any]),
  dataSelecionada: PropTypes.oneOfType([PropTypes.any]),
  id: PropTypes.oneOfType([PropTypes.any]),
};

BotoesAcoesDiarioBordo.defaultProps = {
  onClickVoltar: () => {},
  onClickCancelar: () => {},
  validaAntesDoSubmit: () => {},
  modoEdicao: false,
  desabilitarCampos: false,
  turmaInfantil: false,
  componenteCurricularSelecionado: '',
  dataSelecionada: '',
  id: '',
};

export default BotoesAcoesDiarioBordo;
