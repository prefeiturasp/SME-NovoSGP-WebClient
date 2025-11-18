import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Loader, SelectComponent } from '~/componentes';
import { SGP_SELECT_TIPO_SONDAGEM } from '~/constantes/ids/select';
import { erros } from '~/servicos';
import ServicoRelatorioSondagem from '~/servicos/Paginas/Relatorios/Sondagem/ServicoRelatorioSondagem';

export const TipoSondagem = ({ form, onChange }) => {
  const [exibirLoader, setExibirLoader] = useState(false);
  const [lista, setLista] = useState([]);

  const obterTipos = useCallback(async () => {
    setExibirLoader(true);

    const resposta = await ServicoRelatorioSondagem.obterTipoSondagem()
      .catch(e => erros(e))
      .finally(() => setExibirLoader(false));

    if (resposta?.data?.length) {
      setLista(resposta.data);
    } else {
      setLista([]);
      form.setFieldValue('tipoSondagem', undefined);
    }
  }, []);

  useEffect(() => {
    obterTipos();
  }, []);

  return (
    <Loader loading={exibirLoader} ignorarTip>
      <SelectComponent
        name="tipoSondagem"
        form={form}
        valueOption="id"
        valueText="descricao"
        lista={lista}
        label="Tipo de Sondagem"
        labelRequired
        id={SGP_SELECT_TIPO_SONDAGEM}
        placeholder="Tipo de Sondagem"
        disabled={lista?.length === 1}
        setValueOnlyOnChange
        onChange={newValue => {
          form.setFieldValue('modoEdicao', true);

          form.setFieldValue('tipoSondagem', newValue);
          form.setFieldTouched('tipoSondagem', true, true);
          onChange(newValue);
        }}
      />
    </Loader>
  );
};

TipoSondagem.propTypes = {
  onChange: PropTypes.func,
  form: PropTypes.oneOfType([PropTypes.any]),
};

TipoSondagem.defaultProps = {
  form: null,
  onChange: () => null,
};
