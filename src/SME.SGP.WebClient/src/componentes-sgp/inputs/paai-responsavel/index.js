import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Loader, SelectComponent } from '~/componentes';
import { SGP_SELECT_PAAI_RESPONSAVEL } from '~/constantes/ids/select';
import ServicoEncaminhamentoAEE from '~/servicos/Paginas/Relatorios/AEE/ServicoEncaminhamentoAEE';
import { erros } from '~/servicos';

export const PAAIResponsavel = React.memo(
  ({ name, form, onChange, disabled, allowClear, multiple }) => {
    const [exibirLoader, setExibirLoader] = useState(false);
    const [responsaveisPAAI, setResponsaveisPAAI] = useState([]);

    const dreCodigo = form.values?.dreCodigo;

    const obterResponsaveisPAAI = useCallback(async () => {
      setExibirLoader(true);
      const resposta = await ServicoEncaminhamentoAEE.obterResponsaveisPAAIPesquisa(
        null,
        dreCodigo
      ).catch(e => erros(e));

      const dados = resposta?.data?.items;
      if (dados?.length) {
        const listaResp = dados.map(item => {
          return {
            ...item,
            codigoRF: item.codigoRf,
            nomeServidorFormatado: `${item.nomeServidor} - ${item.codigoRf}`,
          };
        });

        setResponsaveisPAAI(listaResp);
      }

      setExibirLoader(false);
    }, [dreCodigo]);

    useEffect(() => {
      setResponsaveisPAAI([]);
      form.setFieldValue(name, undefined);

      if (dreCodigo) obterResponsaveisPAAI();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dreCodigo]);

    return (
      <Loader loading={exibirLoader} ignorarTip>
        <SelectComponent
          showSearch
          searchValue
          form={form}
          name={name}
          disabled={disabled}
          multiple={multiple}
          onChange={onChange}
          label="PAAI responsável"
          allowClear={allowClear}
          lista={responsaveisPAAI}
          valueOption="codigoRF"
          valueText="nomeServidorFormatado"
          id={SGP_SELECT_PAAI_RESPONSAVEL}
          placeholder="Pesquise por nome ou RF"
        />
      </Loader>
    );
  }
);

PAAIResponsavel.propTypes = {
  name: PropTypes.string,
  disabled: PropTypes.bool,
  onChange: PropTypes.func,
  allowClear: PropTypes.bool,
  multiple: PropTypes.bool,
  form: PropTypes.oneOfType([PropTypes.any]),
};

PAAIResponsavel.defaultProps = {
  form: null,
  disabled: false,
  allowClear: true,
  name: 'responsavelPAAI',
  multiple: false,
  onChange: () => null,
};
