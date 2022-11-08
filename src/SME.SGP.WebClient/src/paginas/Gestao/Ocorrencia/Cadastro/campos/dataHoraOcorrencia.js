import { Col } from 'antd';
import PropTypes from 'prop-types';
import React from 'react';
import { CampoData } from '~/componentes';

const DataHoraOcorrencia = ({ form, onChangeCampos, desabilitar }) => {
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
      <Col sm={24} md={6}>
        <CampoData
          id="SGP_DATE_DATA_OCORRENCIA"
          label="Data da ocorrência"
          name="dataOcorrencia"
          form={form}
          onChange={onChangeCampos}
          placeholder="Selecione a data"
          formatoData="DD/MM/YYYY"
          desabilitarData={desabilitarData}
          desabilitado={desabilitar}
          labelRequired
        />
      </Col>
      <Col sm={24} md={6}>
        <CampoData
          id="SGP_DATE_HORA_OCORRENCIA"
          label="Hora da ocorrência"
          name="horaOcorrencia"
          form={form}
          onChange={onChangeCampos}
          placeholder="Selecione a hora"
          formatoData="HH:mm"
          somenteHora
          desabilitado={desabilitar}
        />
      </Col>
    </>
  );
};

DataHoraOcorrencia.propTypes = {
  form: PropTypes.oneOfType([PropTypes.object]),
  desabilitar: PropTypes.bool,
  onChangeCampos: PropTypes.func,
};

DataHoraOcorrencia.defaultProps = {
  form: null,
  desabilitar: false,
  onChangeCampos: () => null,
};

export default DataHoraOcorrencia;
