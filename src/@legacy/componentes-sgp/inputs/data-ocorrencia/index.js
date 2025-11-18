import { Col } from 'antd';
import * as moment from 'moment';
import PropTypes from 'prop-types';
import { CampoData } from '~/componentes';
import {
  SGP_DATE_FIM_OCORRENCIA,
  SGP_DATE_INICIO_OCORRENCIA,
} from '~/constantes/ids/date';

export const DataOcorrencia = ({
  form,
  disabled,
  onChangeDataInicio,
  onChangeDataFim,
}) => {
  const anoLetivo = form.values?.anoLetivo;

  const desabilitarDatas = current => {
    if (current && anoLetivo) {
      const ano = moment(`${anoLetivo}-01-01`);
      return current < ano.startOf('year') || current > ano.endOf('year');
    }
    return false;
  };

  return (
    <>
      <Col sm={24} md={12} lg={6}>
        <CampoData
          id={SGP_DATE_INICIO_OCORRENCIA}
          label="Data da ocorrência"
          formatoData="DD/MM/YYYY"
          placeholder="Data inicial"
          onChange={newValue => {
            form.setFieldValue('modoEdicao', true);

            form.setFieldValue('dataInicio', newValue);
            form.setFieldTouched('dataInicio', true, true);
            onChangeDataInicio(newValue);
          }}
          desabilitarData={desabilitarDatas}
          desabilitado={disabled}
          form={form}
          name="dataInicio"
        />
      </Col>

      <Col sm={24} md={12} lg={6} style={{ marginTop: '25px' }}>
        <CampoData
          id={SGP_DATE_FIM_OCORRENCIA}
          formatoData="DD/MM/YYYY"
          placeholder="Data final"
          onChange={newValue => {
            form.setFieldValue('modoEdicao', true);

            form.setFieldValue('dataFim', newValue);
            form.setFieldTouched('dataFim', true, true);
            onChangeDataFim(newValue);
          }}
          desabilitarData={desabilitarDatas}
          desabilitado={disabled}
          form={form}
          name="dataFim"
        />
      </Col>
    </>
  );
};

DataOcorrencia.propTypes = {
  form: PropTypes.oneOfType([PropTypes.any]),
  disabled: PropTypes.bool,
  onChangeDataInicio: PropTypes.func,
  onChangeDataFim: PropTypes.func,
};

DataOcorrencia.defaultProps = {
  form: null,
  disabled: false,
  onChangeDataInicio: () => null,
  onChangeDataFim: () => null,
};
