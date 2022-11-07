import { Col, Row } from 'antd';
import PropTypes from 'prop-types';
import React from 'react';
import { CampoData } from '~/componentes';

const DataHoraOcorrencia = ({ form, onChangeCampos, desabilitarCampos }) => {
  const desabilitarData = current => {
    if (current) {
      return (
        current < window.moment().startOf('year') || current >= window.moment()
      );
    }
    return false;
  };
  return (
    <>
      <Row gutter={[16, 16]} type="flex" justify="space-betwenn">
        <Col span={12}>
          <CampoData
            label="Data da ocorrência"
            name="dataOcorrencia"
            form={form}
            onChange={onChangeCampos}
            placeholder="Selecione a data"
            formatoData="DD/MM/YYYY"
            desabilitarData={desabilitarData}
            desabilitado={desabilitarCampos()}
            labelRequired
          />
        </Col>
        <Col span={12}>
          <CampoData
            label="Hora da ocorrência"
            name="horaOcorrencia"
            form={form}
            onChange={onChangeCampos}
            placeholder="Selecione a hora"
            formatoData="HH:mm"
            somenteHora
            campoOpcional
            desabilitado={desabilitarCampos()}
          />
        </Col>
      </Row>
    </>
  );
};

DataHoraOcorrencia.propTypes = {
  form: PropTypes.oneOfType([PropTypes.object]),
  desabilitarCampos: PropTypes.func,
  onChangeCampos: PropTypes.func,
};

DataHoraOcorrencia.defaultProps = {
  form: null,
  desabilitarCampos: () => null,
  onChangeCampos: () => null,
};

export default DataHoraOcorrencia;
