import { Col, Row } from 'antd';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Alert, Loader, SelectComponent } from '~/componentes';
import { SGP_SELECT_PERIODO_POR_COMPONENTE_CURRICULAR } from '~/componentes-sgp/filtro/idsCampos';
import { confirmar, erros } from '~/servicos';
import ServicoPeriodoEscolar from '~/servicos/Paginas/Calendario/ServicoPeriodoEscolar';
import ServicoFrequencia from '~/servicos/Paginas/DiarioClasse/ServicoFrequencia';
import ListaoContext from '../../../listaoContext';
import ListaoListaFrequencia from './lista/listaoListaFrequencia';

const TabListaoFrequencia = () => {
  const usuario = useSelector(store => store.usuario);
  const emEdicao = useSelector(store => store.geral.telaEmEdicao);
  const { turmaSelecionada } = usuario;
  const { turma } = turmaSelecionada;

  const pergutarParaSalvar = () => {
    return confirmar(
      'Atenção',
      '',
      'Suas alterações não foram salvas, deseja salvar agora?'
    );
  };

  const {
    componenteCurricular,
    bimestreOperacoes,
    setExibirLoaderGeral,
    listaPeriodos,
    setListaPeriodos,
    periodo,
    setPeriodo,
    dadosFrequencia,
    setDadosFrequencia,
  } = useContext(ListaoContext);

  const [exibirLoaderPeriodo, setExibirLoaderPeriodo] = useState(false);

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

  const onChangePeriodo = async valor => {
    const aposValidarSalvar = () => {
      const periodoSelecionado = obterPeriodoSelecionado(valor);
      if (periodoSelecionado) {
        setPeriodo({ ...periodoSelecionado });
      } else {
        setPeriodo();
      }
    };

    if (emEdicao) {
      const confirmado = await pergutarParaSalvar();
      if (confirmado) {
        const salvou = true; //TODO mudar para função correta
        if (salvou) {
          aposValidarSalvar();
        }
      } else {
        aposValidarSalvar();
      }
    } else {
      aposValidarSalvar();
    }
  };

  const obterFrequenciasPorPeriodo = useCallback(async () => {
    setExibirLoaderGeral(true);
    const resposta = await ServicoFrequencia.obterFrequenciasPorPeriodo(
      periodo?.dataInicio,
      periodo?.dataFim,
      turma,
      componenteCurricular?.codigoComponenteCurricular
    )
      .catch(e => erros(e))
      .finally(() => setExibirLoaderGeral(false));

    if (resposta?.data) {
      const tiposFrequencia = await ServicoFrequencia.obterTipoFrequencia(
        turmaSelecionada?.modalidade,
        turmaSelecionada?.anoLetivo
      ).catch(e => erros(e));

      resposta.data.listaTiposFrequencia = tiposFrequencia?.data?.length
        ? tiposFrequencia.data
        : [];

      // TODO - Remover - início!
      resposta.data.listaFrequencia.forEach(item => {
        const detalheAluno = [
          {
            dataAula: '2021-12-07T00:00:00',
            indicativoFrequencia: {
              percentual: '100',
              tipo: 3,
            },
            aulas: [
              {
                numeroAula: 1,
                tipoFrequencia: 'C',
              },
              {
                numeroAula: 2,
                tipoFrequencia: 'C',
              },
            ],
          },
          {
            dataAula: '2021-12-14T00:00:00',
            indicativoFrequencia: {
              percentual: '90',
              tipo: 3,
            },
            aulas: [
              {
                numeroAula: 1,
                tipoFrequencia: 'C',
              },
              {
                numeroAula: 2,
                tipoFrequencia: 'C',
              },
              {
                numeroAula: 3,
                tipoFrequencia: 'F',
              },
            ],
          },
          {
            dataAula: '2021-12-08T00:00:00',
            indicativoFrequencia: {
              percentual: '90',
              tipo: 3,
            },
            aulas: [
              {
                numeroAula: 1,
                tipoFrequencia: 'C',
              },
              {
                numeroAula: 2,
                tipoFrequencia: 'C',
              },
              {
                numeroAula: 3,
                tipoFrequencia: 'C',
              },
              {
                numeroAula: 4,
                tipoFrequencia: 'C',
              },
            ],
          },
        ];
        item.detalhesAulas = detalheAluno;
      });
      // TODO - Remover - fim!

      setDadosFrequencia(resposta.data);
    } else {
      setDadosFrequencia();
    }
  }, [
    componenteCurricular,
    turma,
    turmaSelecionada,
    periodo,
    setExibirLoaderGeral,
  ]);

  useEffect(() => {
    if (
      periodo?.dataInicio &&
      periodo?.dataFim &&
      componenteCurricular?.codigoComponenteCurricular &&
      turma &&
      bimestreOperacoes
    ) {
      obterFrequenciasPorPeriodo();
    } else {
      setDadosFrequencia();
    }
  }, [
    periodo,
    componenteCurricular,
    turma,
    bimestreOperacoes,
    obterFrequenciasPorPeriodo,
  ]);

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
      <Row gutter={[24, 24]}>
        <Col sm={24} md={12} lg={8}>
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
        </Col>
      </Row>

      {dadosFrequencia?.listaFrequencia?.length ? (
        <ListaoListaFrequencia />
      ) : (
        <></>
      )}
    </>
  );
};

export default TabListaoFrequencia;
