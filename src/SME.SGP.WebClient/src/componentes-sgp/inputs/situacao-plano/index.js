import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Loader, SelectComponent } from '~/componentes';
import { SGP_SELECT_SITUACAO_PLANO } from '~/constantes/ids/select';
import ServicoPlanoAEE from '~/servicos/Paginas/Relatorios/AEE/ServicoPlanoAEE';
import { erros } from '~/servicos';

export const SituacaoPlano = ({
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

    const resposta = await ServicoPlanoAEE.obterSituacoes()
      .catch(e => erros(e))
      .finally(() => setExibirLoader(false));

    if (resposta?.data?.length) {
      const lista = updateData ? updateData(resposta.data) : resposta.data;

      setListaSituacoes(lista);
    } else {
      setListaSituacoes([]);
      form.setFieldValue(name, undefined);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateData]);

  useEffect(() => {
    obterSituacoes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Loader loading={exibirLoader} ignorarTip>
      <SelectComponent
        name={name}
        form={form}
        onChange={onChange}
        multiple={multiple}
        valueOption="codigo"
        valueText="descricao"
        lista={listaSituacoes}
        showSearch={showSearch}
        label="Situação do plano"
        labelRequired={labelRequired}
        id={SGP_SELECT_SITUACAO_PLANO}
        placeholder="Selecione uma situação do plano"
        disabled={listaSituacoes?.length === 1 || disabled}
      />
    </Loader>
  );
};

SituacaoPlano.propTypes = {
  name: PropTypes.string,
  disabled: PropTypes.bool,
  multiple: PropTypes.bool,
  onChange: PropTypes.func,
  showSearch: PropTypes.bool,
  labelRequired: PropTypes.bool,
  form: PropTypes.oneOfType([PropTypes.any]),
  updateData: PropTypes.oneOfType([PropTypes.any]),
};

SituacaoPlano.defaultProps = {
  form: null,
  disabled: false,
  multiple: true,
  showSearch: true,
  labelRequired: false,
  onChange: () => null,
  name: 'situacaoPlano',
  updateData: () => null,
};
