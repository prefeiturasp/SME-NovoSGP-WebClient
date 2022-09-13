import { Button, Tooltip } from 'antd';
import PropTypes from 'prop-types';
import React from 'react';
import { Base } from '~/componentes/colors';
import tipoFrequenciaDto from '~/dtos/tipoFrequencia';

const CampoTiposFrequencia = props => {
  const { onChange, desabilitar, listaTiposFrequencia, tipoFrequencia } = props;

  const obterCorAtual = tipo => {
    if (tipo.valor === tipoFrequencia) {
      return tipo.cor;
    }

    return Base.CinzaDivisor;
  };

  const temTipoNaLista = tipo =>
    listaTiposFrequencia?.find(item => item?.valor === tipo);

  const onClick = valor => {
    if (!desabilitar) {
      onChange(valor);
    }
  };

  const montarBotao = (background, valor, tituloTooltip) => {
    return (
      <Tooltip title={tituloTooltip} destroyTooltipOnHide>
        <Button
          disabled={desabilitar}
          size="small"
          style={{
            background,
            color: Base.Branco,
          }}
          shape="circle"
          onClick={() => onClick(valor)}
        >
          {valor}
        </Button>
      </Tooltip>
    );
  };

  return (
    <div
      className={`d-flex ${desabilitar ? 'desabilitar' : ''}`}
      style={{ justifyContent: 'space-evenly' }}
    >
      {temTipoNaLista(tipoFrequenciaDto.Compareceu.valor) &&
        montarBotao(
          obterCorAtual(tipoFrequenciaDto.Compareceu),
          tipoFrequenciaDto.Compareceu.valor,
          'Compareceu'
        )}
      {temTipoNaLista(tipoFrequenciaDto.Faltou.valor) &&
        montarBotao(
          obterCorAtual(tipoFrequenciaDto.Faltou),
          tipoFrequenciaDto.Faltou.valor,
          'Faltou'
        )}
      {temTipoNaLista(tipoFrequenciaDto.Remoto.valor) &&
        montarBotao(
          obterCorAtual(tipoFrequenciaDto.Remoto),
          tipoFrequenciaDto.Remoto.valor,
          'Remoto'
        )}
    </div>
  );
};

CampoTiposFrequencia.propTypes = {
  onChange: PropTypes.oneOfType(PropTypes.func),
  desabilitar: PropTypes.bool,
  listaTiposFrequencia: PropTypes.oneOfType(PropTypes.array),
  tipoFrequencia: PropTypes.string,
};

CampoTiposFrequencia.defaultProps = {
  onChange: () => {},
  desabilitar: false,
  listaTiposFrequencia: [],
  tipoFrequencia: '',
};

export default CampoTiposFrequencia;
