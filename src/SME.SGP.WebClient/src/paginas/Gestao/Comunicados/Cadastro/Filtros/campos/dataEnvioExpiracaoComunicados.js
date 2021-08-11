import * as moment from 'moment';
import PropTypes from 'prop-types';
import React from 'react';
import { CampoData } from '~/componentes';

const DataEnvioExpiracaoComunicados = ({
  form,
  onChangeCampos,
  desabilitar,
}) => {
  const { anoLetivo } = form.values;

  const desabilitarDatas = current => {
    if (current && anoLetivo) {
      const ano = moment(`${anoLetivo}-01-01`);
      return current < moment().startOf('day') || current > ano.endOf('year');
    }
    return false;
  };

  return (
    <>
      <div className="col-sm-12 col-md-6 col-lg-4 mb-2">
        <CampoData
          id="data-envio"
          label="Data de envio"
          formatoData="DD/MM/YYYY"
          placeholder="Selecione a data"
          onChange={() => onChangeCampos()}
          desabilitarData={desabilitarDatas}
          desabilitado={desabilitar}
          form={form}
          name="dataEnvio"
        />
      </div>
      <div className="col-sm-12 col-md-6 col-lg-4 mb-2">
        <CampoData
          id="data-expiracao"
          label="Data de expiração"
          formatoData="DD/MM/YYYY"
          placeholder="Selecione a data"
          onChange={() => onChangeCampos()}
          desabilitarData={desabilitarDatas}
          desabilitado={desabilitar}
          form={form}
          name="dataExpiracao"
        />
      </div>
    </>
  );
};

DataEnvioExpiracaoComunicados.propTypes = {
  form: PropTypes.oneOfType([PropTypes.object]),
  onChangeCampos: PropTypes.func,
  desabilitar: PropTypes.bool,
};

DataEnvioExpiracaoComunicados.defaultProps = {
  form: null,
  onChangeCampos: () => null,
  desabilitar: false,
};

export default DataEnvioExpiracaoComunicados;
