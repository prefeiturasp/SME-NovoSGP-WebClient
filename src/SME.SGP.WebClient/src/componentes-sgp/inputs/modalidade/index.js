import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useState } from 'react';
import { Loader, SelectComponent } from '~/componentes';
import { SGP_SELECT_MODALIDADE } from '~/constantes/ids/select';
import { erros, ServicoFiltroRelatorio } from '~/servicos';

export const Modalidade = ({
  name,
  form,
  onChange,
  disabled,
  ueCodigo,
  showSearch,
  labelRequired,
}) => {
  const [exibirLoader, setExibirLoader] = useState(false);
  const [listaModalidades, setListaModalidades] = useState([]);

  const { anoLetivo } = form.values;
  const consideraHistorico = !!form.values?.consideraHistorico;

  const obterModalidades = useCallback(async () => {
    setExibirLoader(true);

    const resposta = await ServicoFiltroRelatorio.obterModalidades(
      ueCodigo,
      anoLetivo,
      consideraHistorico
    )
      .catch(e => erros(e))
      .finally(() => setExibirLoader(false));

    if (resposta?.data?.length) {
      const lista = resposta.data;

      setListaModalidades(lista);
    } else {
      form.setFieldValue(name, undefined);
      setListaModalidades([]);
    }
  }, [form, name, consideraHistorico, anoLetivo, ueCodigo]);

  useEffect(() => {
    if (ueCodigo) {
      obterModalidades();
    } else {
      form.setFieldValue(name, undefined);
      setListaModalidades([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ueCodigo]);

  return (
    <Loader loading={exibirLoader} ignorarTip>
      <SelectComponent
        name={name}
        form={form}
        label="Modalidade"
        valueOption="valor"
        valueText="descricao"
        onChange={onChange()}
        showSearch={showSearch}
        lista={listaModalidades}
        id={SGP_SELECT_MODALIDADE}
        labelRequired={labelRequired}
        disabled={!ueCodigo || disabled}
        placeholder="Selecione uma modalidade"
      />
    </Loader>
  );
};

Modalidade.propTypes = {
  name: PropTypes.string,
  disabled: PropTypes.bool,
  onChange: PropTypes.func,
  showSearch: PropTypes.bool,
  ueCodigo: PropTypes.string,
  labelRequired: PropTypes.bool,
  form: PropTypes.oneOfType([PropTypes.any]),
};

Modalidade.defaultProps = {
  form: null,
  ueCodigo: '',
  disabled: false,
  showSearch: false,
  name: 'modalidade',
  onChange: () => null,
  labelRequired: false,
};
