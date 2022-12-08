import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Loader, SelectComponent } from '~/componentes';
import { SGP_SELECT_SITUACAO_PLANO } from '~/constantes/ids/select';

export const SituacaoPlano = ({
  name,
  form,
  onChange,
  disabled,
  showSearch,
  labelRequired,
}) => {
  const [exibirLoader, setExibirLoader] = useState(false);
  const [listaSituacoes, setListaSituacoes] = useState([]);

  const obterSituacoes = useCallback(async () => {
    setExibirLoader(true);

    // TODO: Função para buscar situações
  }, []);

  useEffect(() => {
    if (true) {
      obterSituacoes();
    } else {
      form.setFieldValue(name, undefined);
      setListaSituacoes([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Loader loading={exibirLoader} ignorarTip>
      <SelectComponent
        name={name}
        form={form}
        valueText="nome"
        valueOption="codigo"
        onChange={onChange()}
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
  onChange: PropTypes.func,
  showSearch: PropTypes.bool,
  labelRequired: PropTypes.bool,
  form: PropTypes.oneOfType([PropTypes.any]),
};

SituacaoPlano.defaultProps = {
  form: null,
  disabled: false,
  showSearch: true,
  labelRequired: true,
  onChange: () => null,
  name: 'situacaoPlano',
};
