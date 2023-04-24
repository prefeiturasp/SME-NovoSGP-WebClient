import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Loader, SelectComponent } from '~/componentes';
import { SGP_SELECT_SITUACAO_ENCAMINHAMENTO_NAAPA } from '~/constantes/ids/select';
import { erros } from '~/servicos';
import ServicoNAAPA from '~/servicos/Paginas/Gestao/NAAPA/ServicoNAAPA';

export const SituacaoEncaminhamentoNAAPA = ({
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

    const resposta = await ServicoNAAPA.buscarSituacoes()
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
        valueOption="id"
        valueText="descricao"
        lista={listaSituacoes}
        showSearch={showSearch}
        label="Situação do encaminhamento"
        labelRequired={labelRequired}
        id={SGP_SELECT_SITUACAO_ENCAMINHAMENTO_NAAPA}
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

SituacaoEncaminhamentoNAAPA.propTypes = {
  name: PropTypes.string,
  disabled: PropTypes.bool,
  multiple: PropTypes.bool,
  onChange: PropTypes.func,
  showSearch: PropTypes.bool,
  labelRequired: PropTypes.bool,
  form: PropTypes.oneOfType([PropTypes.any]),
  updateData: PropTypes.oneOfType([PropTypes.any]),
};

SituacaoEncaminhamentoNAAPA.defaultProps = {
  form: null,
  disabled: false,
  multiple: true,
  showSearch: true,
  labelRequired: false,
  onChange: () => null,
  name: 'situacaoIds',
  updateData: () => null,
};
