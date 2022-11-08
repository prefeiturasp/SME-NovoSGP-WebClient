import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import { SelectComponent } from '~/componentes';
import { ServicoOcorrencias } from '~/servicos';

const TipoOcorrencia = ({ form, onChangeCampos, desabilitar }) => {
  const [listaTiposOcorrencias, setListaTiposOcorrencias] = useState([]);

  useEffect(() => {
    ServicoOcorrencias.buscarTiposOcorrencias().then(resposta => {
      if (resposta?.data?.length) {
        setListaTiposOcorrencias(resposta.data);
      } else {
        setListaTiposOcorrencias([]);
      }
    });
  }, []);

  return (
    <SelectComponent
      id="SGP_SELECT_TIPO_OCORRENCIA"
      form={form}
      name="ocorrenciaTipoId"
      placeholder="Tipo da ocorrência"
      label="Tipo da ocorrência"
      valueOption="id"
      valueText="descricao"
      lista={listaTiposOcorrencias}
      disabled={desabilitar}
      onChange={() => {
        onChangeCampos();
      }}
      allowClear
      labelRequired
    />
  );
};

TipoOcorrencia.propTypes = {
  form: PropTypes.oneOfType([PropTypes.object]),
  onChangeCampos: PropTypes.func,
  desabilitar: PropTypes.bool,
};

TipoOcorrencia.defaultProps = {
  form: null,
  onChangeCampos: () => null,
  desabilitar: false,
};

export default TipoOcorrencia;
