import { Col, Row } from 'antd';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Alert, Loader, SelectComponent } from '~/componentes';
import { SGP_SELECT_PERIODO_POR_COMPONENTE_CURRICULAR } from '~/componentes-sgp/filtro/idsCampos';
import { erros } from '~/servicos';
import ServicoPeriodoEscolar from '~/servicos/Paginas/Calendario/ServicoPeriodoEscolar';
import ListaoContext from '../../../listaoContext';

const TabListaoFrequencia = () => {
  const usuario = useSelector(store => store.usuario);
  const { turmaSelecionada } = usuario;
  const { turma } = turmaSelecionada;

  const { componenteCurricular, bimestreOperacoes } = useContext(ListaoContext);

  const [exibirLoaderPeriodo, setExibirLoaderPeriodo] = useState(false);
  const [listaPeriodos, setListaPeriodos] = useState([]);
  const [periodo, setPeriodo] = useState();

  const desabilitarPeriodo =
    !turma ||
    !bimestreOperacoes ||
    !componenteCurricular?.codigoComponenteCurricular ||
    listaPeriodos?.length === 1 ||
    !listaPeriodos?.length;

  const obterPeriodoPorComponente = useCallback(async () => {
    setExibirLoaderPeriodo(true);
    const resposta = await ServicoPeriodoEscolar.obterPeriodoPorComponente(
      turma,
      componenteCurricular?.codigoComponenteCurricular,
      componenteCurricular?.regencia,
      bimestreOperacoes
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
  }, [componenteCurricular, turma, bimestreOperacoes]);

  useEffect(() => {
    if (
      componenteCurricular?.codigoComponenteCurricular &&
      turma &&
      bimestreOperacoes
    ) {
      obterPeriodoPorComponente();
    } else {
      setListaPeriodos([]);
      setPeriodo();
    }
  }, [
    obterPeriodoPorComponente,
    bimestreOperacoes,
    componenteCurricular,
    turma,
  ]);

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

  const onChangePeriodo = valor => {
    const periodoSelecionado = obterPeriodoSelecionado(valor);
    if (periodoSelecionado) {
      setPeriodo({ ...periodoSelecionado });
    } else {
      setPeriodo();
    }
  };

  return (
    <>
      {componenteCurricular?.codigoComponenteCurricular &&
      !componenteCurricular?.registraFrequencia ? (
        <Alert
          alerta={{
            tipo: 'warning',
            id: 'alerta-listao-frequencia',
            mensagem: 'Componente selecionado não lança frequência',
            estiloTitulo: { fontSize: '18px' },
          }}
          className="mb-2"
        />
      ) : (
        <></>
      )}
      <Col span={24}>
        <Row gutter={[16, 16]}>
          <Col sm={24} md={12} lg={8}>
            <Loader loading={exibirLoaderPeriodo} tip="">
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
          </Col>
        </Row>
      </Col>
      Listão frequência
    </>
  );
};

export default TabListaoFrequencia;
