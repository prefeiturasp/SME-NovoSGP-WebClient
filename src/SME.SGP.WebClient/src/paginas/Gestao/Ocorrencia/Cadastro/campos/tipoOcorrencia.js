import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { Loader, SelectComponent } from '~/componentes';

const TipoOcorrencia = ({ form, onChangeCampos, desabilitar }) => {
  const [exibirLoader, setExibirLoader] = useState(false);
  const [listaUes, setListaUes] = useState([]);

  return (
    <Loader loading={exibirLoader} ignorarTip>
      <SelectComponent
        id="codigo-ue"
        label="Tipo de ocorrência"
        lista={listaUes}
        // disabled={!codigoDre || listaUes?.length === 1 || desabilitar}
        placeholder="Situação"
        showSearch
        // name={nomeCampo}
        form={form}
        labelRequired
        onChange={() => {
          onChangeCampos();
          form.setFieldValue('modalidades', []);
          form.setFieldValue('semestre', undefined);
          form.setFieldValue('turmas', []);
          //   dispatch(setAlunosComunicados([]));
        }}
      />
    </Loader>
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
