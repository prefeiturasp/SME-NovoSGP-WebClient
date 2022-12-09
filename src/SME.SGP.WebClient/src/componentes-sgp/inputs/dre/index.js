import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Loader, SelectComponent } from '~/componentes';
import { FiltroHelper } from '~/componentes-sgp';
import { OPCAO_TODOS } from '~/constantes';
import { SGP_SELECT_DRE } from '~/constantes/ids/select';
import { AbrangenciaServico, erros } from '~/servicos';

export const Dre = ({
  name,
  form,
  onChange,
  disabled,
  showSearch,
  labelRequired,
  mostrarOpcaoTodas,
}) => {
  const [listaDres, setListaDres] = useState([]);
  const [exibirLoader, setExibirLoader] = useState(false);

  const { anoLetivo } = form.values;
  const consideraHistorico = !!form.values?.consideraHistorico;

  const limparDados = () => {
    setListaDres([]);
    form.setFieldValue(name, undefined);
  };

  const obterDres = useCallback(async () => {
    setExibirLoader(true);

    const resposta = await AbrangenciaServico.buscarDres(
      `v1/abrangencias/${consideraHistorico}/dres?anoLetivo=${anoLetivo}`
    )
      .catch(e => erros(e))
      .finally(() => setExibirLoader(false));

    if (resposta?.data?.length) {
      const lista = resposta.data.sort(FiltroHelper.ordenarLista('nome'));

      if (lista?.length === 1) {
        form.setFieldValue(name, String(lista[0]?.codigo));
      } else if (mostrarOpcaoTodas) {
        const OPCAO_TODAS_DRE = { codigo: OPCAO_TODOS, nome: 'Todas' };
        lista.unshift(OPCAO_TODAS_DRE);
      }

      setListaDres(lista);
    } else {
      limparDados();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [anoLetivo, consideraHistorico]);

  useEffect(() => {
    limparDados();

    if (anoLetivo) obterDres();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [anoLetivo]);

  return (
    <Loader loading={exibirLoader} ignorarTip>
      <SelectComponent
        name={name}
        form={form}
        lista={listaDres}
        valueText="nome"
        valueOption="codigo"
        id={SGP_SELECT_DRE}
        onChange={onChange}
        showSearch={showSearch}
        labelRequired={labelRequired}
        label="Diretoria Regional de Educação (DRE)"
        placeholder="Diretoria Regional De Educação (DRE)"
        disabled={!anoLetivo || listaDres?.length === 1 || disabled}
      />
    </Loader>
  );
};

Dre.propTypes = {
  name: PropTypes.string,
  disabled: PropTypes.bool,
  onChange: PropTypes.func,
  showSearch: PropTypes.bool,
  labelRequired: PropTypes.bool,
  mostrarOpcaoTodas: PropTypes.bool,
  form: PropTypes.oneOfType([PropTypes.any]),
};

Dre.defaultProps = {
  form: null,
  disabled: false,
  showSearch: true,
  name: 'dreCodigo',
  labelRequired: true,
  onChange: () => null,
  mostrarOpcaoTodas: true,
};
