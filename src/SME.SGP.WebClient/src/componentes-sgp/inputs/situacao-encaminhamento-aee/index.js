import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Loader, SelectComponent } from '~/componentes';
import { SGP_SELECT_SITUACAO_ENCAMINHAMENTO_AEE } from '~/constantes/ids/select';
import { erros } from '~/servicos';
import ServicoEncaminhamentoAEE from '~/servicos/Paginas/Relatorios/AEE/ServicoEncaminhamentoAEE';

export const SituacaoEncaminhamentoAEE = ({
  name,
  form,
  onChange,
  disabled,
  multiple,
  showSearch,
  updateData,
  labelRequired,
}) => {
  const [exibirLoader, setExibirLoader] = useState(false);
  const [listaSituacoes, setListaSituacoes] = useState([]);

  const obterSituacoes = useCallback(async () => {
    setExibirLoader(true);

    const resposta = await ServicoEncaminhamentoAEE.obterSituacoes()
      .catch(e => erros(e))
      .finally(() => setExibirLoader(false));

    if (resposta?.data?.length) {
      const lista = updateData ? updateData(resposta.data) : resposta.data;

      setListaSituacoes(lista);
    } else {
      setListaSituacoes([]);
      form.setFieldValue(name, undefined);
    }

  }, [updateData]);

  useEffect(() => {
    obterSituacoes();

  }, []);

  return (
    <Loader loading={exibirLoader} ignorarTip>
      <SelectComponent
        name={name}
        form={form}
        multiple={multiple}
        valueOption="codigo"
        valueText="descricao"
        lista={listaSituacoes}
        showSearch={showSearch}
        label="Situação do encaminhamento"
        labelRequired={labelRequired}
        id={SGP_SELECT_SITUACAO_ENCAMINHAMENTO_AEE}
        placeholder="Situação do encaminhamento"
        disabled={listaSituacoes?.length === 1 || disabled}
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

SituacaoEncaminhamentoAEE.propTypes = {
  name: PropTypes.string,
  disabled: PropTypes.bool,
  multiple: PropTypes.bool,
  onChange: PropTypes.func,
  showSearch: PropTypes.bool,
  labelRequired: PropTypes.bool,
  form: PropTypes.oneOfType([PropTypes.any]),
  updateData: PropTypes.oneOfType([PropTypes.any]),
};

SituacaoEncaminhamentoAEE.defaultProps = {
  form: null,
  disabled: false,
  multiple: true,
  showSearch: true,
  labelRequired: false,
  onChange: () => null,
  name: 'situacaoEncaminhamentoAEE',
  updateData: () => null,
};
