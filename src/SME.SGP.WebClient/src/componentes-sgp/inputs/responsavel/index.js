import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Loader, SelectComponent } from '~/componentes';
import { SGP_SELECT_RESPONSAVEL } from '~/constantes/ids/select';
import ServicoEncaminhamentoAEE from '~/servicos/Paginas/Relatorios/AEE/ServicoEncaminhamentoAEE';
import { erros } from '~/servicos';

export const Responsavel = React.memo(
  ({ name, form, onChange, disabled, allowClear, multiple }) => {
    const [responsaveis, setResponsaveis] = useState([]);
    const [exibirLoader, setExibirLoader] = useState(false);

    const dreCodigo = form.values?.dreCodigo;
    const ueCodigo = form.values?.ueCodigo;
    const turmaCodigo = form.values?.turmaCodigo;

    const obterResponsaveis = useCallback(async () => {
      setExibirLoader(true);

      const resposta = await ServicoEncaminhamentoAEE.obterResponsaveisPesquisa(
        turmaCodigo,
        dreCodigo,
        ueCodigo
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

        setResponsaveis(listaResp);
      }

      setExibirLoader(false);
    }, [turmaCodigo, dreCodigo, ueCodigo]);

    useEffect(() => {
      setResponsaveis([]);
      form.setFieldValue(name, undefined);
      if (dreCodigo && ueCodigo) {
        obterResponsaveis();
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [turmaCodigo, dreCodigo, ueCodigo]);

    return (
      <Loader loading={exibirLoader} ignorarTip>
        <SelectComponent
          showSearch
          searchValue
          form={form}
          name={name}
          label="Responsável"
          onChange={onChange}
          disabled={disabled}
          multiple={multiple}
          lista={responsaveis}
          allowClear={allowClear}
          id={SGP_SELECT_RESPONSAVEL}
          valueText="nomeServidorFormatado"
          valueOption="codigoRF"
          placeholder="Pesquise por nome ou RF"
        />
      </Loader>
    );
  }
);

Responsavel.propTypes = {
  name: PropTypes.string,
  disabled: PropTypes.bool,
  onChange: PropTypes.func,
  allowClear: PropTypes.bool,
  multiple: PropTypes.bool,
  form: PropTypes.oneOfType([PropTypes.any]),
};

Responsavel.defaultProps = {
  form: null,
  disabled: false,
  allowClear: true,
  name: 'responsavel',
  multiple: false,
  onChange: () => null,
};
