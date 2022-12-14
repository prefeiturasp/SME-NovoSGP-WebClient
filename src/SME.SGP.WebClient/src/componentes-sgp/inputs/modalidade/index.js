import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useState } from 'react';
import { OPCAO_TODOS } from '~/constantes';
import { Loader, SelectComponent } from '~/componentes';
import { SGP_SELECT_MODALIDADE } from '~/constantes/ids/select';
import { erros, ServicoFiltroRelatorio } from '~/servicos';

export const Modalidade = ({
  name,
  form,
  onChange,
  disabled,
  showSearch,
  labelRequired,
  mostrarOpcaoTodas,
}) => {
  const [exibirLoader, setExibirLoader] = useState(false);
  const [listaModalidades, setListaModalidades] = useState([]);

  const { anoLetivo, ueCodigo } = form.values;
  const consideraHistorico = !!form.values?.consideraHistorico;

  const limparDados = () => {
    setListaModalidades([]);
    form.setFieldValue(name, undefined);
  };

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

      if (lista?.length === 1) {
        form.setFieldValue(name, String(lista[0]?.valor));
      } else if (mostrarOpcaoTodas) {
        const OPCAO_TODAS_TURMA = { valor: OPCAO_TODOS, descricao: 'Todas' };

        lista.unshift(OPCAO_TODAS_TURMA);
      }

      setListaModalidades(lista);
    } else {
      limparDados();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [consideraHistorico, anoLetivo, ueCodigo]);

  useEffect(() => {
    limparDados();
    if (ueCodigo) obterModalidades();
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
        onChange={onChange}
        showSearch={showSearch}
        lista={listaModalidades}
        id={SGP_SELECT_MODALIDADE}
        labelRequired={labelRequired}
        disabled={!ueCodigo || disabled || listaModalidades?.length === 1}
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
  labelRequired: PropTypes.bool,
  mostrarOpcaoTodas: PropTypes.bool,
  form: PropTypes.oneOfType([PropTypes.any]),
};

Modalidade.defaultProps = {
  form: null,
  disabled: false,
  showSearch: true,
  name: 'modalidade',
  labelRequired: true,
  onChange: () => null,
  mostrarOpcaoTodas: true,
};
