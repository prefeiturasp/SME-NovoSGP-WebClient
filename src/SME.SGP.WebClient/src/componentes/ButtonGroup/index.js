import React from 'react';
import PropTypes from 'prop-types';
import { Col, Row } from 'antd';
import { Button, Colors } from '~/componentes';
import { SGP_BUTTON_CANCELAR } from '~/componentes-sgp/filtro/idsCampos';
import BotaoVoltarPadrao from '~/componentes-sgp/BotoesAcaoPadrao/botaoVoltarPadrao';
import BotaoExcluirPadrao from '~/componentes-sgp/BotoesAcaoPadrao/botaoExcluirPadrao';

function ButtonGroup({
  form,
  modoEdicao,
  novoRegistro,
  permissoesTela,
  temItemSelecionado,
  labelBotaoPrincipal,
  desabilitarBotaoPrincipal,
  onClickVoltar,
  onClickExcluir,
  onClickBotaoPrincipal,
  onClickCancelar,
  somenteConsulta,
  idBotaoPrincipal,
}) {
  const desabilitarExcluir = () => {
    const { podeExcluir } = permissoesTela;
    return (
      somenteConsulta ||
      (!podeExcluir && temItemSelecionado === false) ||
      (!podeExcluir && temItemSelecionado === true) ||
      (podeExcluir && temItemSelecionado === false) ||
      (!podeExcluir && novoRegistro === false) ||
      (podeExcluir && novoRegistro === true)
    );
  };

  return (
    <Row gutter={[8, 8]} type="flex">
      <Col>
        <BotaoVoltarPadrao onClick={() => onClickVoltar()} />
      </Col>
      {typeof onClickCancelar === 'function' && (
        <Col>
          <Button
            id={SGP_BUTTON_CANCELAR}
            label="Cancelar"
            color={Colors.Roxo}
            border
            onClick={() => onClickCancelar(form)}
            disabled={somenteConsulta || !modoEdicao}
          />
        </Col>
      )}
      {typeof onClickExcluir === 'function' && (
        <Col>
          <BotaoExcluirPadrao
            disabled={somenteConsulta || desabilitarExcluir()}
            onClick={() => onClickExcluir()}
          />
        </Col>
      )}
      {typeof onClickBotaoPrincipal === 'function' && (
        <Col>
          <Button
            id={idBotaoPrincipal}
            label={labelBotaoPrincipal}
            color={Colors.Roxo}
            border
            bold
            onClick={onClickBotaoPrincipal}
            disabled={
              desabilitarBotaoPrincipal ||
              somenteConsulta ||
              !permissoesTela.podeIncluir
            }
          />
        </Col>
      )}
    </Row>
  );
}

ButtonGroup.propTypes = {
  form: PropTypes.oneOfType([PropTypes.object, PropTypes.func, PropTypes.any]),
  modoEdicao: PropTypes.bool,
  novoRegistro: PropTypes.bool,
  desabilitarBotaoPrincipal: PropTypes.bool,
  labelBotaoPrincipal: PropTypes.string,
  permissoesTela: PropTypes.oneOfType([PropTypes.object, PropTypes.any]),
  temItemSelecionado: PropTypes.oneOfType([PropTypes.bool, PropTypes.any]),
  onClickVoltar: PropTypes.func,
  onClickExcluir: PropTypes.func,
  onClickCancelar: PropTypes.func,
  onClickBotaoPrincipal: PropTypes.func,
  somenteConsulta: PropTypes.bool,
  idBotaoPrincipal: PropTypes.string,
};

ButtonGroup.defaultProps = {
  form: {},
  permissoesTela: {},
  labelBotaoPrincipal: '',
  modoEdicao: false,
  desabilitarBotaoPrincipal: false,
  novoRegistro: null,
  temItemSelecionado: null,
  onClickVoltar: null,
  onClickExcluir: null,
  onClickCancelar: null,
  onClickBotaoPrincipal: null,
  somenteConsulta: false,
  idBotaoPrincipal: '',
};

export default ButtonGroup;
