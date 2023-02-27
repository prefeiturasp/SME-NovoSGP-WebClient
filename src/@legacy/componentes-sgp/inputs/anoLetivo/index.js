import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Loader, SelectComponent } from '~/componentes';
import { FiltroHelper } from '~/componentes-sgp';
import { SGP_SELECT_ANO_LETIVO } from '~/constantes/ids/select';
import { erros } from '~/servicos';
import { ordenarDescPor } from '~/utils';

export const AnoLetivo = ({
  form,
  name,
  nameList,
  disabled,
  onChange,
  showSearch,
  labelRequired,
}) => {
  const [exibirLoader, setExibirLoader] = useState(false);

  const consideraHistorico = !!form.values?.consideraHistorico;
  const listaAnosLetivos = form.values?.[nameList];

  const setInitialValues = !form?.values?.modoEdicao;

  const limparDados = () => {
    form.setFieldValue(name, undefined);
    form.setFieldValue(nameList, []);
  };

  const obterAnosLetivos = useCallback(async () => {
    setExibirLoader(true);

    const resposta = await FiltroHelper.obterAnosLetivos({
      consideraHistorico,
    })
      .catch(e => erros(e))
      .finally(() => setExibirLoader(false));

    if (resposta?.length) {
      const anosOrdenados = ordenarDescPor(resposta, 'valor');

      if (anosOrdenados?.length) {
        const { valor } = anosOrdenados[0];
        if (setInitialValues) {
          form.initialValues[name] = valor;
        }
        form.setFieldValue(name, valor);
      }

      if (setInitialValues) {
        form.initialValues[nameList] = anosOrdenados;
      }
      form.setFieldValue(nameList, anosOrdenados);
    } else {
      limparDados();
    }

  }, [consideraHistorico]);

  useEffect(() => {
    if (form.initialValues[nameList]?.length && setInitialValues) return;

    limparDados();

    obterAnosLetivos();

  }, [obterAnosLetivos]);

  const desabilitar = listaAnosLetivos?.length === 1 || disabled;

  return (
    <Loader loading={exibirLoader} ignorarTip>
      <SelectComponent
        name={name}
        form={form}
        label="Ano Letivo"
        valueText="desc"
        valueOption="valor"
        disabled={desabilitar}
        showSearch={showSearch}
        lista={listaAnosLetivos}
        placeholder="Ano letivo"
        id={SGP_SELECT_ANO_LETIVO}
        labelRequired={labelRequired}
        setValueOnlyOnChange
        onChange={newValue => {
          form.setFieldValue('modoEdicao', true);
          form.setFieldValue(name, newValue);
          form.setFieldTouched(name, true, true);
          onChange(newValue);
        }}
      />
    </Loader>
  );
};

AnoLetivo.propTypes = {
  name: PropTypes.string,
  disabled: PropTypes.bool,
  showSearch: PropTypes.bool,
  labelRequired: PropTypes.bool,
  form: PropTypes.oneOfType([PropTypes.any]),
  onChange: PropTypes.oneOfType([PropTypes.any]),
  nameList: PropTypes.string,
};

AnoLetivo.defaultProps = {
  form: null,
  disabled: false,
  showSearch: true,
  name: 'anoLetivo',
  labelRequired: true,
  onChange: () => null,
  nameList: 'listaAnosLetivos',
};
