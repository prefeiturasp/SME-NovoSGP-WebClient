import PropTypes from 'prop-types';
import React, { useCallback, useContext, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Loader, SelectComponent } from '~/componentes';
import { SGP_SELECT_PERIODO_POR_COMPONENTE_CURRICULAR } from '~/componentes-sgp/filtro/idsCampos';
import { erros } from '~/servicos';
import ServicoPeriodoEscolar from '~/servicos/Paginas/Calendario/ServicoPeriodoEscolar';
import ListaoContext from '../../../listaoContext';

const PeriodoEscolarListao = props => {
  const { limparDadosTabSelecionada, exibirDataFutura } = props;

  const usuario = useSelector(store => store.usuario);
  const telaEmEdicao = useSelector(store => store.geral.telaEmEdicao);
  const { turmaSelecionada } = usuario;
  const { turma } = turmaSelecionada;
  const acaoTelaEmEdicao = useSelector(store => store.geral.acaoTelaEmEdicao);

  const {
    componenteCurricular,
    bimestreOperacoes,
    listaPeriodos,
    setListaPeriodos,
    periodo,
    setPeriodo,
    exibirLoaderPeriodo,
    setExibirLoaderPeriodo,
  } = useContext(ListaoContext);

  const desabilitarPeriodo =
    !turma ||
    !bimestreOperacoes ||
    !componenteCurricular?.codigoComponenteCurricular ||
    listaPeriodos?.length === 1 ||
    !listaPeriodos?.length;

  useEffect(() => {
    return () => {
      setListaPeriodos([]);
      setPeriodo();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const obterPeriodoPorComponente = useCallback(async () => {
    limparDadosTabSelecionada();
    setExibirLoaderPeriodo(true);
    const resposta = await ServicoPeriodoEscolar.obterPeriodoPorComponente(
      turma,
      componenteCurricular?.codigoComponenteCurricular,
      componenteCurricular?.regencia,
      bimestreOperacoes,
      exibirDataFutura
    )
      .catch(e => erros(e))
      .finally(() => setExibirLoaderPeriodo(false));

    if (resposta?.data?.length) {
      const lista = resposta.data.map(item => {
        return { ...item, id: String(item.id) };
      });
      setListaPeriodos(lista);
      if (lista.length === 1) {
        setPeriodo(lista[0]);
      }
    } else {
      setListaPeriodos([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [componenteCurricular, turma, bimestreOperacoes]);

  useEffect(() => {
    setPeriodo();
    setListaPeriodos([]);
    if (componenteCurricular?.codigoComponenteCurricular && bimestreOperacoes) {
      obterPeriodoPorComponente();
    } else {
      limparDadosTabSelecionada();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bimestreOperacoes]);

  const obterPeriodoSelecionado = id => {
    if (id && listaPeriodos?.length) {
      let periodoSelecionado = null;

      periodoSelecionado = listaPeriodos?.find(
        item => Number(item?.id) === Number(id)
      );
      return periodoSelecionado;
    }
    return null;
  };

  const setarPeriodo = valor => {
    const periodoSelecionado = obterPeriodoSelecionado(valor);
    if (periodoSelecionado) {
      setPeriodo({ ...periodoSelecionado });
    } else {
      setPeriodo();
    }
  };

  const onChangePeriodo = async valor => {
    if (telaEmEdicao) {
      const salvou = await acaoTelaEmEdicao();
      if (salvou) {
        limparDadosTabSelecionada();
        setarPeriodo(valor);
      }
    } else {
      setarPeriodo(valor);
    }
  };

  return (
    <Loader loading={exibirLoaderPeriodo} ignorarTip>
      <SelectComponent
        label="Período"
        id={SGP_SELECT_PERIODO_POR_COMPONENTE_CURRICULAR}
        lista={listaPeriodos}
        valueOption="id"
        valueText="periodoEscolar"
        valueSelect={periodo?.id}
        onChange={onChangePeriodo}
        placeholder="Selecione um Período"
        showSearch
        disabled={desabilitarPeriodo}
      />
    </Loader>
  );
};

PeriodoEscolarListao.propTypes = {
  limparDadosTabSelecionada: PropTypes.func,
  exibirDataFutura: PropTypes.bool,
};

PeriodoEscolarListao.defaultProps = {
  limparDadosTabSelecionada: () => {},
  exibirDataFutura: false,
};

export default PeriodoEscolarListao;
