import * as moment from 'moment';
import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useState } from 'react';
import { Loader, SelectComponent } from '~/componentes';

const AnoLetivoComunicados = ({ form, comunicadoId, onChangeCampos }) => {
  const [listaAnosLetivos, setListaAnosLetivos] = useState([]);

  const [anoAtual] = useState(moment().format('YYYY'));

  const obterAnosLetivos = useCallback(async () => {
    let listaAnos = [
      {
        desc: anoAtual,
        valor: anoAtual,
      },
    ];

    if (comunicadoId && form?.values?.anoLetivo) {
      listaAnos = [
        {
          desc: form?.values?.anoLetivo,
          valor: form?.values?.anoLetivo,
        },
      ];
    } else {
      form.setFieldValue('anoLetivo', anoAtual);
      form.initialValues.anoLetivo = anoAtual;
    }

    setListaAnosLetivos(listaAnos);

  }, [anoAtual, comunicadoId]);

  useEffect(() => {
    obterAnosLetivos();
  }, [obterAnosLetivos]);

  return (
    <Loader ignorarTip>
      <SelectComponent
        id="ano-letivo"
        label="Ano Letivo"
        lista={listaAnosLetivos}
        valueOption="valor"
        valueText="desc"
        disabled
        placeholder="Ano letivo"
        name="anoLetivo"
        form={form}
        onChange={() => onChangeCampos()}
        labelRequired
      />
    </Loader>
  );
};

AnoLetivoComunicados.propTypes = {
  form: PropTypes.oneOfType([PropTypes.object]),
  comunicadoId: PropTypes.string,
  onChangeCampos: PropTypes.func,
};

AnoLetivoComunicados.defaultProps = {
  form: null,
  comunicadoId: '',
  onChangeCampos: () => null,
};

export default AnoLetivoComunicados;
